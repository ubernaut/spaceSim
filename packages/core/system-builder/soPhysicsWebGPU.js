class soPhysicsWebGPU {
  constructor(system) {
    this.system = system;
    this.G = 2.93558 * Math.pow(10, -4);
  }

  async init() {
    if (!navigator.gpu) {
      throw new Error("WebGPU not supported on this browser.");
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error("No appropriate GPUAdapter found.");
    }

    this.device = await adapter.requestDevice();

    this.createShaderModules();
    this.createPipelines();
  }

  createShaderModules() {
    this.accelerationShaderModule = this.device.createShaderModule({
      code: `
        struct Body {
          pos: vec3<f32>,
          mass: f32,
          acc: vec3<f32>,
          rad: f32,
        };

        @group(0) @binding(0) var<storage, read> bodies: array<Body>;
        @group(0) @binding(1) var<storage, write> newAcc: array<vec3<f32>>;

        @compute @workgroup_size(64)
        fn computeAcceleration(@builtin(global_invocation_id) global_id: vec3<u32>) {
          let index = global_id.x;
          var acceleration = vec3<f32>(0.0, 0.0, 0.0);

          for (var i = 0u; i < arrayLength(&bodies); i = i + 1u) {
            if (i == index) {
              continue;
            }

            let d_x = bodies[index].pos.x - bodies[i].pos.x;
            let d_y = bodies[index].pos.y - bodies[i].pos.y;
            let d_z = bodies[index].pos.z - bodies[i].pos.z;

            let radius = sqrt(d_x * d_x + d_y * d_y + d_z * d_z);

            if (radius > 0.666 * (bodies[index].rad + bodies[i].rad)) {
              let grav_mag = ${this.G} / (radius * radius * radius);
              acceleration.x = acceleration.x - grav_mag * d_x * bodies[i].mass;
              acceleration.y = acceleration.y - grav_mag * d_y * bodies[i].mass;
              acceleration.z = acceleration.z - grav_mag * d_z * bodies[i].mass;
            }
          }
          newAcc[index] = acceleration;
        }
      `
    });

    this.collisionShaderModule = this.device.createShaderModule({
        code: `
        struct Body {
            pos: vec3<f32>,
            mass: f32,
            acc: vec3<f32>,
            rad: f32,
        };

        @group(0) @binding(0) var<storage, read> bodies: array<Body>;
        @group(0) @binding(1) var<storage, write> collisionResults: array<i32>;

        @compute @workgroup_size(64)
        fn computeCollisions(@builtin(global_invocation_id) global_id: vec3<u32>) {
            let index = global_id.x;
            collisionResults[index] = -1;

            for (var i = index + 1u; i < arrayLength(&bodies); i = i + 1u) {
                let d_x = abs(bodies[index].pos.x - bodies[i].pos.x);
                let d_y = abs(bodies[index].pos.y - bodies[i].pos.y);
                let d_z = abs(bodies[index].pos.z - bodies[i].pos.z);

                let distance = sqrt(d_x * d_x + d_y * d_y + d_z * d_z);
                let bothRads = bodies[index].rad + bodies[i].rad;

                if (distance < 0.66 * bothRads) {
                    collisionResults[index] = i32(i);
                }
            }
        }
        `
    });
  }

  createPipelines() {
    this.accelerationPipeline = this.device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: this.accelerationShaderModule,
        entryPoint: 'computeAcceleration',
      },
    });

    this.collisionPipeline = this.device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: this.collisionShaderModule,
        entryPoint: 'computeCollisions',
      },
    });
  }

  createBuffers(bodies) {
    const bodyData = new Float32Array(bodies.length * 8);
    for (let i = 0; i < bodies.length; i++) {
      bodyData[i * 8 + 0] = bodies[i].pos[0];
      bodyData[i * 8 + 1] = bodies[i].pos[1];
      bodyData[i * 8 + 2] = bodies[i].pos[2];
      bodyData[i * 8 + 3] = bodies[i].mass;
      bodyData[i * 8 + 4] = bodies[i].acc[0];
      bodyData[i * 8 + 5] = bodies[i].acc[1];
      bodyData[i * 8 + 6] = bodies[i].acc[2];
      bodyData[i * 8 + 7] = bodies[i].rad;
    }

    this.bodiesBuffer = this.device.createBuffer({
      size: bodyData.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
    new Float32Array(this.bodiesBuffer.getMappedRange()).set(bodyData);
    this.bodiesBuffer.unmap();

    this.newAccBuffer = this.device.createBuffer({
      size: bodies.length * 3 * 4, // 3 floats per body, 4 bytes per float
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    this.collisionResultBuffer = this.device.createBuffer({
        size: bodies.length * 4, // 1 i32 per body, 4 bytes per i32
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });
  }

  async computeAcceleration(bodies) {
    this.createBuffers(bodies);

    const bindGroup = this.device.createBindGroup({
      layout: this.accelerationPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.bodiesBuffer } },
        { binding: 1, resource: { buffer: this.newAccBuffer } },
      ],
    });

    const commandEncoder = this.device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(this.accelerationPipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatchWorkgroups(Math.ceil(bodies.length / 64));
    passEncoder.end();

    const readBuffer = this.device.createBuffer({
        size: this.newAccBuffer.size,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    commandEncoder.copyBufferToBuffer(
        this.newAccBuffer,
        0,
        readBuffer,
        0,
        this.newAccBuffer.size
    );

    this.device.queue.submit([commandEncoder.finish()]);

    await readBuffer.mapAsync(GPUMapMode.READ);
    const resultArray = new Float32Array(readBuffer.getMappedRange());
    const result = [];
    for (let i = 0; i < resultArray.length; i += 3) {
        result.push([resultArray[i], resultArray[i+1], resultArray[i+2]]);
    }
    readBuffer.destroy();
    return result;
  }

  async computeCollisions(bodies) {
    const bindGroup = this.device.createBindGroup({
        layout: this.collisionPipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: this.bodiesBuffer } },
            { binding: 1, resource: { buffer: this.collisionResultBuffer } },
        ],
    });

    const commandEncoder = this.device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(this.collisionPipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatchWorkgroups(Math.ceil(bodies.length / 64));
    passEncoder.end();

    const readBuffer = this.device.createBuffer({
        size: this.collisionResultBuffer.size,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    commandEncoder.copyBufferToBuffer(
        this.collisionResultBuffer,
        0,
        readBuffer,
        0,
        this.collisionResultBuffer.size
    );

    this.device.queue.submit([commandEncoder.finish()]);

    await readBuffer.mapAsync(GPUMapMode.READ);
    const resultArray = new Int32Array(readBuffer.getMappedRange());
    readBuffer.destroy();
    return Array.from(resultArray);
  }
}

export default soPhysicsWebGPU;
