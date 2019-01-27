import {
  TextureLoader,
  ShaderMaterial,
  RepeatWrapping,
  AdditiveBlending,
  Object3D,
  BufferGeometry,
  BufferAttribute,
  Vector3,
  Color,
  Math as ThreeMath,
  Points
} from 'three'

import vertexShader from 'app/shaders/particles.vs.glsl'
import fragmentShader from 'app/shaders/particles.fs.glsl'

import perlinImage from 'app/assets/images/perlin-512.png'
import particleImage from 'app/assets/images/particle2.png'

/*
 * GPU Particle System
 * Based on code by @author flimshaw - Charlie Hoey - http://charliehoey.com
 */
class GPUParticleSystem extends Object3D {
  constructor (options) {
    super(arguments)

    options = options || {}

    // parse options and use defaults
    this.PARTICLE_COUNT = options.maxParticles || 1000000
    this.PARTICLE_CONTAINERS = options.containerCount || 1

    this.PARTICLE_NOISE_TEXTURE = options.particleNoiseTex || null
    this.PARTICLE_SPRITE_TEXTURE = options.particleSpriteTex || null

    this.PARTICLES_PER_CONTAINER = Math.ceil(
      this.PARTICLE_COUNT / this.PARTICLE_CONTAINERS
    )
    this.PARTICLE_CURSOR = 0
    this.time = 0
    this.particleContainers = []
    this.rand = []

    // preload a million random numbers
    let i
    for (i = 1e5; i > 0; i--) {
      this.rand.push(Math.random() - 0.5)
    }
    this.i = i

    const textureLoader = new TextureLoader()

    this.particleNoiseTex =
      this.PARTICLE_NOISE_TEXTURE || textureLoader.load(perlinImage)
    this.particleNoiseTex.wrapS = this.particleNoiseTex.wrapT = RepeatWrapping

    this.particleSpriteTex =
      this.PARTICLE_SPRITE_TEXTURE || textureLoader.load(particleImage)
    this.particleSpriteTex.wrapS = this.particleSpriteTex.wrapT = RepeatWrapping

    this.particleShaderMat = new ShaderMaterial({
      transparent: true,
      depthTest: false,
      uniforms: {
        uTime: {
          value: 0.0
        },
        uScale: {
          value: 1.0
        },
        tNoise: {
          value: this.particleNoiseTex
        },
        tSprite: {
          value: this.particleSpriteTex
        },
        uVelocityZ: {
          value: 1.0
        }
      },
      blending: AdditiveBlending,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    })

    // define defaults for all values
    this.particleShaderMat.defaultAttributeValues.particlePositionsStartTime = [
      0,
      0,
      0,
      0
    ]
    this.particleShaderMat.defaultAttributeValues.particleVelColSizeLife = [
      0,
      0,
      0,
      0
    ]

    this.random = this.random.bind(this)
  }

  random () {
    return ++this.i >= this.rand.length
      ? this.rand[(this.i = 1)]
      : this.rand[this.i]
  }

  init () {
    for (let i = 0; i < this.PARTICLE_CONTAINERS; i++) {
      const c = new GPUParticleContainer(this.PARTICLES_PER_CONTAINER, this)
      this.particleContainers.push(c)
      this.add(c)
      c.init()
    }
  }

  spawnParticle (options) {
    this.PARTICLE_CURSOR++
    if (this.PARTICLE_CURSOR >= this.PARTICLE_COUNT) {
      this.PARTICLE_CURSOR = 1
    }
    const currentContainer = this.particleContainers[
      Math.floor(this.PARTICLE_CURSOR / this.PARTICLES_PER_CONTAINER)
    ]
    currentContainer.spawnParticle(options)
  }

  update (time) {
    for (let i = 0; i < this.PARTICLE_CONTAINERS; i++) {
      this.particleContainers[i].update(time)
    }
  }

  dispose () {
    this.particleShaderMat.dispose()
    this.particleNoiseTex.dispose()
    this.particleSpriteTex.dispose()
    for (let i = 0; i < this.PARTICLE_CONTAINERS; i++) {
      this.particleContainers[i].dispose()
    }
  }
}

/**
 * Subclass for particle containers, allows for very large arrays to be spread out
 */
class GPUParticleContainer extends Object3D {
  constructor (maxParticles, particleSystem) {
    super(arguments)

    this.PARTICLE_COUNT = maxParticles || 100000
    this.PARTICLE_CURSOR = 0
    this.time = 0
    this.offset = 0
    this.count = 0
    this.DPR = window.devicePixelRatio
    this.GPUParticleSystem = particleSystem
    this.particleUpdate = false
    this.parentSystem = particleSystem

    // geometry
    this.particleShaderGeo = new BufferGeometry()

    // attributes
    this.particleShaderGeo.addAttribute(
      'position',
      new BufferAttribute(
        new Float32Array(this.PARTICLE_COUNT * 3),
        3
      ).setDynamic(true)
    )
    this.particleShaderGeo.addAttribute(
      'positionStart',
      new BufferAttribute(
        new Float32Array(this.PARTICLE_COUNT * 3),
        3
      ).setDynamic(true)
    )
    this.particleShaderGeo.addAttribute(
      'startTime',
      new BufferAttribute(new Float32Array(this.PARTICLE_COUNT), 1).setDynamic(
        true
      )
    )
    this.particleShaderGeo.addAttribute(
      'velocity',
      new BufferAttribute(
        new Float32Array(this.PARTICLE_COUNT * 3),
        3
      ).setDynamic(true)
    )
    this.particleShaderGeo.addAttribute(
      'turbulence',
      new BufferAttribute(new Float32Array(this.PARTICLE_COUNT), 1).setDynamic(
        true
      )
    )
    this.particleShaderGeo.addAttribute(
      'color',
      new BufferAttribute(
        new Float32Array(this.PARTICLE_COUNT * 3),
        3
      ).setDynamic(true)
    )
    this.particleShaderGeo.addAttribute(
      'size',
      new BufferAttribute(new Float32Array(this.PARTICLE_COUNT), 1).setDynamic(
        true
      )
    )
    this.particleShaderGeo.addAttribute(
      'lifeTime',
      new BufferAttribute(new Float32Array(this.PARTICLE_COUNT), 1).setDynamic(
        true
      )
    )

    // material
    this.particleShaderMat = this.GPUParticleSystem.particleShaderMat
  }

  spawnParticle (options) {
    const positionStartAttribute = this.particleShaderGeo.getAttribute(
      'positionStart'
    )
    const startTimeAttribute = this.particleShaderGeo.getAttribute('startTime')
    const velocityAttribute = this.particleShaderGeo.getAttribute('velocity')
    const turbulenceAttribute = this.particleShaderGeo.getAttribute(
      'turbulence'
    )
    const colorAttribute = this.particleShaderGeo.getAttribute('color')
    const sizeAttribute = this.particleShaderGeo.getAttribute('size')
    const lifeTimeAttribute = this.particleShaderGeo.getAttribute('lifeTime')

    options = options || {}

    // setup reasonable default values for all arguments
    let position = new Vector3()
    let velocity = new Vector3()
    let color = new Color()

    position =
      options.position !== undefined
        ? position.copy(options.position)
        : position.set(0, 0, 0)
    velocity =
      options.velocity !== undefined
        ? velocity.copy(options.velocity)
        : velocity.set(0, 0, 0)
    color =
      options.color !== undefined
        ? color.set(options.color)
        : color.set(0xffffff)

    const positionRandomness =
      options.positionRandomness !== undefined ? options.positionRandomness : 0
    const velocityRandomness =
      options.velocityRandomness !== undefined ? options.velocityRandomness : 0
    const colorRandomness =
      options.colorRandomness !== undefined ? options.colorRandomness : 1
    const turbulence = options.turbulence !== undefined ? options.turbulence : 1
    const lifetime = options.lifetime !== undefined ? options.lifetime : 5
    let size = options.size !== undefined ? options.size : 10
    const sizeRandomness =
      options.sizeRandomness !== undefined ? options.sizeRandomness : 0
    const smoothPosition =
      options.smoothPosition !== undefined ? options.smoothPosition : false

    if (this.DPR !== undefined) {
      size *= this.DPR
    }

    const i = this.PARTICLE_CURSOR

    // position
    positionStartAttribute.array[i * 3 + 0] =
      position.x + this.parentSystem.random() * positionRandomness
    positionStartAttribute.array[i * 3 + 1] =
      position.y + this.parentSystem.random() * positionRandomness
    positionStartAttribute.array[i * 3 + 2] =
      position.z + this.parentSystem.random() * positionRandomness

    if (smoothPosition === true) {
      positionStartAttribute.array[i * 3 + 0] += -(
        velocity.x * this.parentSystem.random()
      )
      positionStartAttribute.array[i * 3 + 1] += -(
        velocity.y * this.parentSystem.random()
      )
      positionStartAttribute.array[i * 3 + 2] += -(
        velocity.z * this.parentSystem.random()
      )
    }

    const velX = velocity.x + this.parentSystem.random() * velocityRandomness
    const velY = velocity.y + this.parentSystem.random() * velocityRandomness
    const velZ = velocity.z + this.parentSystem.random() * velocityRandomness

    velocityAttribute.array[i * 3 + 0] = velX
    velocityAttribute.array[i * 3 + 1] = velY
    velocityAttribute.array[i * 3 + 2] = velZ

    // color
    color.r = ThreeMath.clamp(
      color.r + this.parentSystem.random() * colorRandomness,
      0,
      1
    )
    color.g = ThreeMath.clamp(
      color.g + this.parentSystem.random() * colorRandomness,
      0,
      1
    )
    color.b = ThreeMath.clamp(
      color.b + this.parentSystem.random() * colorRandomness,
      0,
      1
    )

    colorAttribute.array[i * 3 + 0] = color.r
    colorAttribute.array[i * 3 + 1] = color.g
    colorAttribute.array[i * 3 + 2] = color.b

    // turbulence, size, lifetime and starttime
    turbulenceAttribute.array[i] = turbulence
    sizeAttribute.array[i] = size + this.parentSystem.random() * sizeRandomness
    lifeTimeAttribute.array[i] = lifetime
    startTimeAttribute.array[i] = this.time + this.parentSystem.random() * 2e-2

    // offset
    if (this.offset === 0) {
      this.offset = this.PARTICLE_CURSOR
    }

    // counter and cursor
    this.count++
    this.PARTICLE_CURSOR++

    if (this.PARTICLE_CURSOR >= this.PARTICLE_COUNT) {
      this.PARTICLE_CURSOR = 0
    }
    this.particleUpdate = true
  }

  init () {
    this.particleSystem = new Points(
      this.particleShaderGeo,
      this.particleShaderMat
    )
    this.particleSystem.frustumCulled = false
    this.add(this.particleSystem)
  }

  update (time) {
    this.time = time
    this.particleShaderMat.uniforms.uTime.value = time
    this.geometryUpdate()
  }

  geometryUpdate () {
    if (this.particleUpdate === true) {
      this.particleUpdate = false

      const positionStartAttribute = this.particleShaderGeo.getAttribute(
        'positionStart'
      )
      const startTimeAttribute = this.particleShaderGeo.getAttribute(
        'startTime'
      )
      const velocityAttribute = this.particleShaderGeo.getAttribute('velocity')
      const turbulenceAttribute = this.particleShaderGeo.getAttribute(
        'turbulence'
      )
      const colorAttribute = this.particleShaderGeo.getAttribute('color')
      const sizeAttribute = this.particleShaderGeo.getAttribute('size')
      const lifeTimeAttribute = this.particleShaderGeo.getAttribute('lifeTime')

      if (this.offset + this.count < this.PARTICLE_COUNT) {
        positionStartAttribute.updateRange.offset =
          this.offset * positionStartAttribute.itemSize
        startTimeAttribute.updateRange.offset =
          this.offset * startTimeAttribute.itemSize
        velocityAttribute.updateRange.offset =
          this.offset * velocityAttribute.itemSize
        turbulenceAttribute.updateRange.offset =
          this.offset * turbulenceAttribute.itemSize
        colorAttribute.updateRange.offset =
          this.offset * colorAttribute.itemSize
        sizeAttribute.updateRange.offset = this.offset * sizeAttribute.itemSize
        lifeTimeAttribute.updateRange.offset =
          this.offset * lifeTimeAttribute.itemSize

        positionStartAttribute.updateRange.count =
          this.count * positionStartAttribute.itemSize
        startTimeAttribute.updateRange.count =
          this.count * startTimeAttribute.itemSize
        velocityAttribute.updateRange.count =
          this.count * velocityAttribute.itemSize
        turbulenceAttribute.updateRange.count =
          this.count * turbulenceAttribute.itemSize
        colorAttribute.updateRange.count = this.count * colorAttribute.itemSize
        sizeAttribute.updateRange.count = this.count * sizeAttribute.itemSize
        lifeTimeAttribute.updateRange.count =
          this.count * lifeTimeAttribute.itemSize
      } else {
        positionStartAttribute.updateRange.offset = 0
        startTimeAttribute.updateRange.offset = 0
        velocityAttribute.updateRange.offset = 0
        turbulenceAttribute.updateRange.offset = 0
        colorAttribute.updateRange.offset = 0
        sizeAttribute.updateRange.offset = 0
        lifeTimeAttribute.updateRange.offset = 0

        // Use -1 to update the entire buffer, see #11476
        positionStartAttribute.updateRange.count = -1
        startTimeAttribute.updateRange.count = -1
        velocityAttribute.updateRange.count = -1
        turbulenceAttribute.updateRange.count = -1
        colorAttribute.updateRange.count = -1
        sizeAttribute.updateRange.count = -1
        lifeTimeAttribute.updateRange.count = -1
      }

      positionStartAttribute.needsUpdate = true
      startTimeAttribute.needsUpdate = true
      velocityAttribute.needsUpdate = true
      turbulenceAttribute.needsUpdate = true
      colorAttribute.needsUpdate = true
      sizeAttribute.needsUpdate = true
      lifeTimeAttribute.needsUpdate = true

      this.offset = 0
      this.count = 0
    }
  }

  dispose () {
    this.particleShaderGeo.dispose()
  }
}

export { GPUParticleSystem, GPUParticleContainer }
