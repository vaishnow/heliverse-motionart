import { useEffect, useRef } from "react";
import { Pointer } from "../types/webgl";
import webglTexture from "../assets/webgl/LDR_LLL1_0.png";
import { baseVertexSource,advectionSource,bloomBlurSource,bloomFinalSource,bloomPrefilterSource,blurSource,blurVertexSource,checkerboardSource,clearSource,colorSource,copySource,curlSource,displayShaderSource,divergenceSource,gradientSubtractSource,pressureSource,splatSource,sunraysMaskSource,sunraysSource,vorticitySource } from "../data/shaderSources";

// REFRENCE: https://github.com/PavelDoGreat/WebGL-Fluid-Simulation

const WebGLCanvas = () => {
  const webglCanvas = useRef(null);

  let pointers: any[] = [];
  let splatStack: number[] = [];
  pointers.push(new (pointerPrototype as any)());

  let config = {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 512,
    DENSITY_DISSIPATION: 1,
    VELOCITY_DISSIPATION: 1,
    PRESSURE: 0.8,
    PRESSURE_ITERATIONS: 20,
    CURL: 30,
    SPLAT_RADIUS: 0.5,
    SPLAT_FORCE: 6000,
    SHADING: false,
    COLORFUL: true,
    COLOR_UPDATE_SPEED: 10,
    PAUSED: false,
    BACK_COLOR: { r: 2, g: 3, b: 15 },
    TRANSPARENT: false,
    BLOOM: true,
    BLOOM_ITERATIONS: 8,
    BLOOM_RESOLUTION: 256,
    BLOOM_INTENSITY: 0.8,
    BLOOM_THRESHOLD: 0.6,
    BLOOM_SOFT_KNEE: 0.7,
    SUNRAYS: true,
    SUNRAYS_RESOLUTION: 196,
    SUNRAYS_WEIGHT: 1.0,
  };

  function pointerPrototype(this: any) {
      this.id= -1,
      this.texcoordX= 0,
      this.texcoordY= 0,
      this.prevTexcoordX= 0,
      this.prevTexcoordY= 0,
      this.deltaX= 0,
      this.deltaY= 0,
      this.down= false,
      this.moved= false,
      this.color= [30, 0, 300];
    }

  
function HSVtoRGB (h:number, s:number, v:number){
  let r:number, g:number, b:number, i:number, f:number, p:number, q:number, t:number;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);

  switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
      default: r = v, g = p, b = q; break;
  }

  return {
      r,
      g,
      b
  };
}


function supportRenderTextureFormat (gl: any, internalFormat: any, format: any, type: any) {
  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

  let fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  return status == gl.FRAMEBUFFER_COMPLETE;
}


function getSupportedFormat (gl: any, internalFormat: any, format: any, type: any)
{
    if (!supportRenderTextureFormat(gl, internalFormat, format, type))
    {
        switch (internalFormat)
        {
            case gl.R16F:
                return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
            case gl.RG16F:
                return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
            default:
                return null;
        }
    }

    return {
        internalFormat,
        format
    }
}



function isMobile () {
  return /Mobi|Android/i.test(navigator.userAgent);
}


  useEffect(() => {
    const canvas: HTMLCanvasElement = webglCanvas.current!;
    
    const { gl, ext } = getWebGLContext(canvas);

    function updatePointerDownData (pointer:Pointer, id:number, posX:number, posY:number) {
      pointer.id = id;
      pointer.down = true;
      pointer.moved = false;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1.0 - posY / canvas.height;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.deltaX = 0;
      pointer.deltaY = 0;
      pointer.color = generateColor();
  }


  function correctDeltaX (delta: number) {
    let aspectRatio = canvas.width / canvas.height;
    if (aspectRatio < 1) delta *= aspectRatio;
    return delta;
  }
  
  function correctDeltaY (delta: number) {
    let aspectRatio = canvas.width / canvas.height;
    if (aspectRatio > 1) delta /= aspectRatio;
    return delta;
  }
  
  function updatePointerMoveData (pointer:Pointer, posX: number, posY: number) {
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1.0 - posY / canvas.height;
      pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
      pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
      pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
  }
  
  function updatePointerUpData (pointer:Pointer) {
      pointer.down = false;
  }
  
  
function getWebGLContext (canvas:HTMLCanvasElement) {
  const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };

  let gl :any = canvas.getContext('webgl2', params);
  const isWebGL2 = !!gl;
  if (!isWebGL2)
      gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);

  let halfFloat;
  let supportLinearFiltering;
  if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float');
      supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
  } else {
      halfFloat = gl.getExtension('OES_texture_half_float');
      supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES;
  let formatRGBA;
  let formatRG;
  let formatR;

  if (isWebGL2)
  {
      formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
      formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
  }
  else
  {
      formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
  }

  return {
      gl,
      ext: {
          formatRGBA,
          formatRG,
          formatR,
          halfFloatTexType,
          supportLinearFiltering
      }
  };
}


function compileShader (type: any, source: any, keywords?: string[] | null | undefined) {
  source = addKeywords(source, keywords);

  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      console.trace(gl.getShaderInfoLog(shader));

  return shader;
};

function addKeywords (source: string, keywords: any[] | null | undefined) {
  if (keywords == null) return source;
  let keywordsString = '';
  keywords.forEach(keyword => {
      keywordsString += '#define ' + keyword + '\n';
  });
  return keywordsString + source;
}


const baseVertexShader = compileShader(gl.VERTEX_SHADER,baseVertexSource);
const blurVertexShader = compileShader(gl.VERTEX_SHADER,blurVertexSource);
const blurShader = compileShader(gl.FRAGMENT_SHADER,blurSource);
const copyShader = compileShader(gl.FRAGMENT_SHADER,copySource);
const clearShader = compileShader(gl.FRAGMENT_SHADER,clearSource);
const colorShader = compileShader(gl.FRAGMENT_SHADER,colorSource);
const checkerboardShader = compileShader(gl.FRAGMENT_SHADER,checkerboardSource);
const bloomPrefilterShader = compileShader(gl.FRAGMENT_SHADER,bloomPrefilterSource);
const bloomBlurShader = compileShader(gl.FRAGMENT_SHADER,bloomBlurSource);
const bloomFinalShader = compileShader(gl.FRAGMENT_SHADER,bloomFinalSource);
const sunraysMaskShader = compileShader(gl.FRAGMENT_SHADER,sunraysMaskSource);
const sunraysShader = compileShader(gl.FRAGMENT_SHADER,sunraysSource);
const splatShader = compileShader(gl.FRAGMENT_SHADER,splatSource);
const advectionShader = compileShader(gl.FRAGMENT_SHADER,advectionSource,
    ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']
);
const divergenceShader = compileShader(gl.FRAGMENT_SHADER,divergenceSource);
const curlShader = compileShader(gl.FRAGMENT_SHADER,curlSource);
const vorticityShader = compileShader(gl.FRAGMENT_SHADER,vorticitySource);
const pressureShader = compileShader(gl.FRAGMENT_SHADER,pressureSource);
const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER,gradientSubtractSource);

class Material {
  vertexShader: any;
  fragmentShaderSource: string;
  programs: any;
  activeProgram: null;
  uniforms: any;
  constructor (vertexShader: any, fragmentShaderSource: string) {
      this.vertexShader = vertexShader;
      this.fragmentShaderSource = fragmentShaderSource;
      this.programs = [];
      this.activeProgram = null;
      this.uniforms = [];
  }

  setKeywords (keywords: string[] | null | undefined) {
      let hash = 0;
      if(keywords){
        for (let i = 0; i < keywords.length; i++)
            hash += hashCode(keywords[i]);
      }
      let program = this.programs[hash];
      if (program == null)
      {
          let fragmentShader = compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
          program = createProgram(this.vertexShader, fragmentShader);
          this.programs[hash] = program;
      }

      if (program == this.activeProgram) return;

      this.uniforms = getUniforms(program);
      this.activeProgram = program;
  }

  bind () {
      gl.useProgram(this.activeProgram);
  }
}


class Program {
  uniforms: any;
  program: any;
  constructor (vertexShader: any, fragmentShader: any) {
      this.uniforms = {};
      this.program = createProgram(vertexShader, fragmentShader);
      this.uniforms = getUniforms(this.program);
  }

  bind () {
      gl.useProgram(this.program);
  }
}

function createProgram (vertexShader: any, fragmentShader: any) {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      console.trace(gl.getProgramInfoLog(program));

  return program;
}

function getUniforms (program: any) {
  let uniforms = [];
  let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < uniformCount; i++) {
      let uniformName = gl.getActiveUniform(program, i).name;
      uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
  }
  return uniforms;
}

if (isMobile()) {
  config.DYE_RESOLUTION = 512;
}
if (!ext.supportLinearFiltering) {
  config.DYE_RESOLUTION = 512;
  config.SHADING = false;
  config.BLOOM = false;
  config.SUNRAYS = false;
}

const blit = (() => {
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  return (target: { width: any; height: any; fbo: any; } | null, clear = false) => {
      if (target == null)
      {
          gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      else
      {
          gl.viewport(0, 0, target.width, target.height);
          gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      if (clear)
      {
          gl.clearColor(0.0, 0.0, 0.0, 1.0);
          gl.clear(gl.COLOR_BUFFER_BIT);
      }
      CHECK_FRAMEBUFFER_STATUS();
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }
})();

function CHECK_FRAMEBUFFER_STATUS () {
  let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status != gl.FRAMEBUFFER_COMPLETE)
      console.trace("Framebuffer error: " + status);
}



let dye: { texelSizeX: any; texelSizeY: any; read: any; write: any; swap?: any; width: any; height: any; } | null;
let velocity: { texelSizeX: any; texelSizeY: any; read: any; write: any; swap?: any; width: any; height: any; } | null
let divergence: { attach: any; texture?: any; fbo: any; width: any; height: any; texelSizeX?: number; texelSizeY?: number; };
let curl: { attach: any; texture?: any; fbo: any; width: any; height: any; texelSizeX?: number; texelSizeY?: number; };
let pressure: { read: any; write: any; swap: any; width?: any; height?: any; texelSizeX?: number; texelSizeY?: number; };
let bloom: { attach: any; texture?: any; fbo?: any; width?: any; height?: any; texelSizeX?: number; texelSizeY?: number; };
let bloomFramebuffers: any[] = [];
let sunrays: { attach: any; texture?: any; fbo: any; width: any; height: any; texelSizeX: number; texelSizeY: number; };
let sunraysTemp: { texture: any; fbo: any; width: any; height: any; texelSizeX: number; texelSizeY: number; attach(id: any): any; };

let ditheringTexture = createTextureAsync(webglTexture);

const blurProgram            = new Program(blurVertexShader, blurShader);
const copyProgram            = new Program(baseVertexShader, copyShader);
const clearProgram           = new Program(baseVertexShader, clearShader);
const colorProgram           = new Program(baseVertexShader, colorShader);
const checkerboardProgram    = new Program(baseVertexShader, checkerboardShader);
const bloomPrefilterProgram  = new Program(baseVertexShader, bloomPrefilterShader);
const bloomBlurProgram       = new Program(baseVertexShader, bloomBlurShader);
const bloomFinalProgram      = new Program(baseVertexShader, bloomFinalShader);
const sunraysMaskProgram     = new Program(baseVertexShader, sunraysMaskShader);
const sunraysProgram         = new Program(baseVertexShader, sunraysShader);
const splatProgram           = new Program(baseVertexShader, splatShader);
const advectionProgram       = new Program(baseVertexShader, advectionShader);
const divergenceProgram      = new Program(baseVertexShader, divergenceShader);
const curlProgram            = new Program(baseVertexShader, curlShader);
const vorticityProgram       = new Program(baseVertexShader, vorticityShader);
const pressureProgram        = new Program(baseVertexShader, pressureShader);
const gradienSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);

const displayMaterial = new Material(baseVertexShader, displayShaderSource);

    window.addEventListener("mouseover", (e) => {
    console.log("DBG: mouseenter : " ) //DEBUG/Exposure
      let posX = scaleByPixelRatio(e.offsetX);
      let posY = scaleByPixelRatio(e.offsetY);
      let pointer = pointers.find((p) => p.id == -1);
      if (pointer == null) pointer = new (pointerPrototype as any)();
      updatePointerDownData(pointer, -1, posX, posY);
    });

    window.addEventListener("mousemove", (e) => {
    console.log("DBG: mousemove : " ) //DEBUG/Exposure
      let pointer = pointers[0];
      if (!pointer.down) return;
      let posX = scaleByPixelRatio(e.offsetX);
      let posY = scaleByPixelRatio(e.offsetY);
      updatePointerMoveData(pointer, posX, posY);
    });


    window.addEventListener("mouseout", () => {
    console.log("DBG: mouseleave : " ) //DEBUG/Exposure
      updatePointerUpData(pointers[0]);
    });

    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touches = e.targetTouches;
      while (touches.length >= pointers.length)
        pointers.push(new (pointerPrototype as any)());
      for (let i = 0; i < touches.length; i++) {
        let posX = (touches[i].pageX);
        let posY = (touches[i].pageY);
        updatePointerDownData(
          pointers[i + 1],
          touches[i].identifier,
          posX,
          posY
        );
      }
    });

    canvas.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
        const touches = e.targetTouches;
        for (let i = 0; i < touches.length; i++) {
          let pointer = pointers[i + 1];
          if (!pointer.down) continue;
          let posX = (touches[i].pageX);
          let posY = (touches[i].pageY);
          updatePointerMoveData(pointer, posX, posY);
        }
      },
      false
    );

    window.addEventListener("touchend", (e) => {
      const touches = e.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        let pointer = pointers.find((p) => p.id == touches[i].identifier);
        if (pointer == null) continue;
        updatePointerUpData(pointer);
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.code === "KeyP") config.PAUSED = !config.PAUSED;
      if (e.key === " ") splatStack.push((Math.random() * 20) + 5 );
    });

    
function initFramebuffers () {
  let simRes = getResolution(config.SIM_RESOLUTION);
  let dyeRes = getResolution(config.DYE_RESOLUTION);

  const texType = ext.halfFloatTexType;
  const rgba    = ext.formatRGBA;
  const rg      = ext.formatRG;
  const r       = ext.formatR;
  const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

  gl.disable(gl.BLEND);

  if (dye == null)
      dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba?.internalFormat, rgba?.format, texType, filtering);
  else
      dye = resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba?.internalFormat, rgba?.format, texType, filtering);

  if (velocity == null)
      velocity = createDoubleFBO(simRes.width, simRes.height, rg?.internalFormat, rg?.format, texType, filtering);
  else
      velocity = resizeDoubleFBO(velocity, simRes.width, simRes.height, rg?.internalFormat, rg?.format, texType, filtering);

  divergence = createFBO      (simRes.width, simRes.height, r?.internalFormat, r?.format, texType, gl.NEAREST);
  curl       = createFBO      (simRes.width, simRes.height, r?.internalFormat, r?.format, texType, gl.NEAREST);
  pressure   = createDoubleFBO(simRes.width, simRes.height, r?.internalFormat, r?.format, texType, gl.NEAREST);

  initBloomFramebuffers();
  initSunraysFramebuffers();
}

function initBloomFramebuffers () {
  let res = getResolution(config.BLOOM_RESOLUTION);

  const texType = ext.halfFloatTexType;
  const rgba = ext.formatRGBA;
  const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

  bloom = createFBO(res.width, res.height, rgba?.internalFormat, rgba?.format, texType, filtering);

  bloomFramebuffers.length = 0;
  for (let i = 0; i < config.BLOOM_ITERATIONS; i++)
  {
      let width = res.width >> (i + 1);
      let height = res.height >> (i + 1);

      if (width < 2 || height < 2) break;

      let fbo = createFBO(width, height, rgba?.internalFormat, rgba?.format, texType, filtering);
      bloomFramebuffers.push(fbo);
  }
}

function initSunraysFramebuffers () {
  let res = getResolution(config.SUNRAYS_RESOLUTION);

  const texType = ext.halfFloatTexType;
  const r = ext.formatR;
  const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

  sunrays     = createFBO(res.width, res.height, r?.internalFormat, r?.format, texType, filtering);
  sunraysTemp = createFBO(res.width, res.height, r?.internalFormat, r?.format, texType, filtering);
}

function createFBO (w: number, h: number, internalFormat: any, format: any, type: any, param: any) {
  gl.activeTexture(gl.TEXTURE0);
  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

  let fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.viewport(0, 0, w, h);
  gl.clear(gl.COLOR_BUFFER_BIT);

  let texelSizeX = 1.0 / w;
  let texelSizeY = 1.0 / h;

  return {
      texture,
      fbo,
      width: w,
      height: h,
      texelSizeX,
      texelSizeY,
      attach (id: any) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
      }
  };
}

function createDoubleFBO (w: number, h: number, internalFormat: any, format: any, type: any, param: any) {
  let fbo1 = createFBO(w, h, internalFormat, format, type, param);
  let fbo2 = createFBO(w, h, internalFormat, format, type, param);

  return {
      width: w,
      height: h,
      texelSizeX: fbo1.texelSizeX,
      texelSizeY: fbo1.texelSizeY,
      get read () {
          return fbo1;
      },
      set read (value) {
          fbo1 = value;
      },
      get write () {
          return fbo2;
      },
      set write (value) {
          fbo2 = value;
      },
      swap () {
          let temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
      }
  }
}

function resizeFBO (target: { attach: (arg0: number) => any; }, w: any, h: any, internalFormat: any, format: any, type: any, param: any) {
  let newFBO = createFBO(w, h, internalFormat, format, type, param);
  copyProgram.bind();
  gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
  blit(newFBO);
  return newFBO;
}

function resizeDoubleFBO (target: { width: any; height: any; read: { texture: any; fbo: any; width: any; height: any; texelSizeX: number; texelSizeY: number; attach(id: any): any; }; write: { texture: any; fbo: any; width: any; height: any; texelSizeX: number; texelSizeY: number; attach(id: any): any; }; texelSizeX: number; texelSizeY: number; }, w: number, h: number, internalFormat: any, format: any, type: any, param: any) {
  if (target.width == w && target.height == h)
      return target;
  target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
  target.write = createFBO(w, h, internalFormat, format, type, param);
  target.width = w;
  target.height = h;
  target.texelSizeX = 1.0 / w;
  target.texelSizeY = 1.0 / h;
  return target;
}

function createTextureAsync (url: string) {
  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255]));

  let obj = {
      texture,
      width: 1,
      height: 1,
      attach (id: number) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
      }
  };

  let image = new Image();
  image.onload = () => {
      obj.width = image.width;
      obj.height = image.height;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  };
  image.src = url;

  return obj;
}

function updateKeywords () {
  let displayKeywords = [];
  if (config.SHADING) displayKeywords.push("SHADING");
  if (config.BLOOM) displayKeywords.push("BLOOM");
  if (config.SUNRAYS) displayKeywords.push("SUNRAYS");
  displayMaterial.setKeywords(displayKeywords);
}

updateKeywords();
initFramebuffers();
multipleSplats((Math.random() * 20) + 5);

let lastUpdateTime = Date.now();
let colorUpdateTimer = 0.0;
update();

function update () {
  const dt = calcDeltaTime();
  if (resizeCanvas())
      initFramebuffers();
  updateColors(dt);
  applyInputs();
  // if (!config.PAUSED)
      step(dt);
  render(null);
  requestAnimationFrame(update);
}

function calcDeltaTime () {
  let now = Date.now();
  let dt = (now - lastUpdateTime) / 1000;
  dt = Math.min(dt, 0.016666);
  lastUpdateTime = now;
  return dt;
}

function resizeCanvas () {
  let width = scaleByPixelRatio(canvas.clientWidth);
  let height = scaleByPixelRatio(canvas.clientHeight);
  if (canvas.width != width || canvas.height != height) {
      canvas.width = width;
      canvas.height = height;
      return true;
  }
  return false;
}

function updateColors (dt: number) {
  if (!config.COLORFUL) return;

  colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
  if (colorUpdateTimer >= 1) {
      colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
      pointers.forEach(p => {
          p.color = generateColor();
      });
  }
}

function applyInputs () {
  if (splatStack.length > 0)
      multipleSplats(splatStack.pop()!);

  pointers.forEach(p => {
      if (p.moved) {
          p.moved = false;
          splatPointer(p);
      }
  });
}

function step (dt: number) {
  gl.disable(gl.BLEND);

  curlProgram.bind();
  gl.uniform2f(curlProgram.uniforms.texelSize, velocity?.texelSizeX, velocity?.texelSizeY);
  gl.uniform1i(curlProgram.uniforms.uVelocity, velocity?.read.attach(0));
  blit(curl);

  vorticityProgram.bind();
  gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity?.texelSizeX, velocity?.texelSizeY);
  gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity?.read.attach(0));
  gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
  gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
  gl.uniform1f(vorticityProgram.uniforms.dt, dt);
  blit(velocity?.write);
  velocity?.swap();

  divergenceProgram.bind();
  gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity?.texelSizeX, velocity?.texelSizeY);
  gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity?.read.attach(0));
  blit(divergence);

  clearProgram.bind();
  gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
  gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
  blit(pressure.write);
  pressure.swap();

  pressureProgram.bind();
  gl.uniform2f(pressureProgram.uniforms.texelSize, velocity?.texelSizeX, velocity?.texelSizeY);
  gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
  for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
      blit(pressure.write);
      pressure.swap();
  }

  gradienSubtractProgram.bind();
  gl.uniform2f(gradienSubtractProgram.uniforms.texelSize, velocity?.texelSizeX, velocity?.texelSizeY);
  gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
  gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity?.read.attach(1));
  blit(velocity?.write);
  velocity?.swap();

  advectionProgram.bind();
  gl.uniform2f(advectionProgram.uniforms.texelSize, velocity?.texelSizeX, velocity?.texelSizeY);
  if (!ext.supportLinearFiltering)
      gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity?.texelSizeX, velocity?.texelSizeY);
  let velocityId = velocity?.read.attach(0);
  gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
  gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
  gl.uniform1f(advectionProgram.uniforms.dt, dt);
  gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
  blit(velocity?.write);
  velocity?.swap();

  if (!ext.supportLinearFiltering)
      gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye?.texelSizeX, dye?.texelSizeY);
  gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity?.read.attach(0));
  gl.uniform1i(advectionProgram.uniforms.uSource, dye?.read.attach(1));
  gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
  blit(dye?.write);
  dye?.swap();
}

function render (target: any) {
  if (config.BLOOM)
      applyBloom(dye?.read, bloom);
  if (config.SUNRAYS) {
      applySunrays(dye?.read, dye?.write, sunrays);
      blur(sunrays, sunraysTemp, 1);
  }

  if (target == null || !config.TRANSPARENT) {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
  }
  else {
      gl.disable(gl.BLEND);
  }

  if (!config.TRANSPARENT)
      drawColor(target, normalizeColor(config.BACK_COLOR));
  if (target == null && config.TRANSPARENT)
      drawCheckerboard(target);
  drawDisplay(target);
}

function drawColor (target: any, color: { r: any; g: any; b: any; }) {
  colorProgram.bind();
  gl.uniform4f(colorProgram.uniforms.color, color.r, color.g, color.b, 1);
  blit(target);
}

function drawCheckerboard (target: any) {
  checkerboardProgram.bind();
  gl.uniform1f(checkerboardProgram.uniforms.aspectRatio, canvas.width / canvas.height);
  blit(target);
}

function drawDisplay (target: { width: any; height: any; fbo:any} | null) {
  let width = target == null ? gl.drawingBufferWidth : target.width;
  let height = target == null ? gl.drawingBufferHeight : target.height;

  displayMaterial.bind();
  if (config.SHADING)
      gl.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height);
  gl.uniform1i(displayMaterial.uniforms.uTexture, dye?.read.attach(0));
  if (config.BLOOM) {
      gl.uniform1i(displayMaterial.uniforms.uBloom, bloom.attach(1));
      gl.uniform1i(displayMaterial.uniforms.uDithering, ditheringTexture.attach(2));
      let scale = getTextureScale(ditheringTexture, width, height);
      gl.uniform2f(displayMaterial.uniforms.ditherScale, scale.x, scale.y);
  }
  if (config.SUNRAYS)
      gl.uniform1i(displayMaterial.uniforms.uSunrays, sunrays.attach(3));
  blit(target);
}

function applyBloom (source: { attach: (arg0: number) => any; }, destination: any) {
  if (bloomFramebuffers.length < 2)
      return;

  let last = destination;

  gl.disable(gl.BLEND);
  bloomPrefilterProgram.bind();
  let knee = config.BLOOM_THRESHOLD * config.BLOOM_SOFT_KNEE + 0.0001;
  let curve0 = config.BLOOM_THRESHOLD - knee;
  let curve1 = knee * 2;
  let curve2 = 0.25 / knee;
  gl.uniform3f(bloomPrefilterProgram.uniforms.curve, curve0, curve1, curve2);
  gl.uniform1f(bloomPrefilterProgram.uniforms.threshold, config.BLOOM_THRESHOLD);
  gl.uniform1i(bloomPrefilterProgram.uniforms.uTexture, source.attach(0));
  blit(last);

  bloomBlurProgram.bind();
  for (let i = 0; i < bloomFramebuffers.length; i++) {
      let dest = bloomFramebuffers[i];
      gl.uniform2f(bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
      gl.uniform1i(bloomBlurProgram.uniforms.uTexture, last.attach(0));
      blit(dest);
      last = dest;
  }

  gl.blendFunc(gl.ONE, gl.ONE);
  gl.enable(gl.BLEND);

  for (let i = bloomFramebuffers.length - 2; i >= 0; i--) {
      let baseTex = bloomFramebuffers[i];
      gl.uniform2f(bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
      gl.uniform1i(bloomBlurProgram.uniforms.uTexture, last.attach(0));
      gl.viewport(0, 0, baseTex.width, baseTex.height);
      blit(baseTex);
      last = baseTex;
  }

  gl.disable(gl.BLEND);
  bloomFinalProgram.bind();
  gl.uniform2f(bloomFinalProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
  gl.uniform1i(bloomFinalProgram.uniforms.uTexture, last.attach(0));
  gl.uniform1f(bloomFinalProgram.uniforms.intensity, config.BLOOM_INTENSITY);
  blit(destination);
}

function applySunrays (source: { attach: (arg0: number) => any; }, mask: { attach: (arg0: number) => any;  width: any; height: any; fbo: any; }, destination: any) {
  gl.disable(gl.BLEND);
  sunraysMaskProgram.bind();
  gl.uniform1i(sunraysMaskProgram.uniforms.uTexture, source.attach(0));
  blit(mask);

  sunraysProgram.bind();
  gl.uniform1f(sunraysProgram.uniforms.weight, config.SUNRAYS_WEIGHT);
  gl.uniform1i(sunraysProgram.uniforms.uTexture, mask.attach(0));
  blit(destination);
}

function blur (target: { texelSizeX: any; attach: (arg0: number) => any; texelSizeY: any; width:any; height: any; fbo: any;}, temp: { attach: (arg0: number) => any; width: any; height: any; fbo: any; }, iterations: number) {
  blurProgram.bind();
  for (let i = 0; i < iterations; i++) {
      gl.uniform2f(blurProgram.uniforms.texelSize, target.texelSizeX, 0.0);
      gl.uniform1i(blurProgram.uniforms.uTexture, target.attach(0));
      blit(temp);

      gl.uniform2f(blurProgram.uniforms.texelSize, 0.0, target.texelSizeY);
      gl.uniform1i(blurProgram.uniforms.uTexture, temp.attach(0));
      blit(target);
  }
}

function splatPointer (pointer: { deltaX: number; deltaY: number; texcoordX: any; texcoordY: any; color: any; }) {
  let dx = pointer.deltaX * config.SPLAT_FORCE;
  let dy = pointer.deltaY * config.SPLAT_FORCE;
  splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
}

function multipleSplats (amount: number) {
  for (let i = 0; i < amount; i++) {
      const color = generateColor();
      color.r *= 10.0;
      color.g *= 10.0;
      color.b *= 10.0;
      const x = Math.random();
      const y = Math.random();
      const dx = 1000 * (Math.random() - 0.5);
      const dy = 1000 * (Math.random() - 0.5);
      splat(x, y, dx, dy, color);
  }
}

function splat (x: number, y: number, dx: number, dy: number, color: { r: any; g: any; b: any; }) {
  splatProgram.bind();
  gl.uniform1i(splatProgram.uniforms.uTarget, velocity?.read.attach(0));
  gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
  gl.uniform2f(splatProgram.uniforms.point, x, y);
  gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
  gl.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100.0));
  blit(velocity?.write);
  velocity?.swap();

  gl.uniform1i(splatProgram.uniforms.uTarget, dye?.read.attach(0));
  gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
  blit(dye?.write);
  dye?.swap();
}

function correctRadius (radius: number) {
  let aspectRatio = canvas.width / canvas.height;
  if (aspectRatio > 1)
      radius *= aspectRatio;
  return radius;
}

function scaleByPixelRatio (input: number) {
  let pixelRatio = window.devicePixelRatio || 1;
  return Math.floor(input * pixelRatio);
}

function generateColor () {
  let c = HSVtoRGB(Math.random(), 1.0, 1.0);
  c.r *= 0.15;
  c.g *= 0.15;
  c.b *= 0.15;
  return c;
}


function normalizeColor (input: { r: any; g: any; b: any; }) {
  let output = {
      r: input.r / 255,
      g: input.g / 255,
      b: input.b / 255
  };
  return output;
}

function wrap (value: number, min: number, max: number) {
  let range = max - min;
  if (range == 0) return min;
  return (value - min) % range + min;
}

function getResolution (resolution: number) {
  let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
  if (aspectRatio < 1)
      aspectRatio = 1.0 / aspectRatio;

  let min = Math.round(resolution);
  let max = Math.round(resolution * aspectRatio);

  if (gl.drawingBufferWidth > gl.drawingBufferHeight)
      return { width: max, height: min };
  else
      return { width: min, height: max };
}

function getTextureScale (texture: { texture?: any; width: any; height: any; attach?: (id: any) => any; }, width: number, height: number) {
  return {
      x: width / texture.width,
      y: height / texture.height
  };
}


function hashCode (s: string) {
  if (s.length == 0) return 0;
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
      hash = (hash << 5) - hash + s.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <canvas ref={webglCanvas} className="size-full"></canvas>
    </div>
  );
};
export default WebGLCanvas;
