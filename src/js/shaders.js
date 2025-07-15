export const vertexShader =`
  varying vec2 vUv;
void main () {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`
;

export const fragmentShader =`
precision mediump float;

uniform vec2 uOffset;
uniform vec2 uResolution;
uniform float uZoom;
uniform float uCellSize;
uniform float uTextureCount;
uniform sampler2D uImageAtlas;
uniform vec4 uBorderColor; // цвет рамки с альфой
uniform float uGridColumns;

varying vec2 vUv;

void main() {
    vec2 screenUV = (vUv - 0.5) * 2.0;
    float radius = length(screenUV);
    float distortion = 1.0 - 0.08 * radius * radius;
    vec2 distortedUV = screenUV * distortion;

    vec2 aspectRatio = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 worldCoord = distortedUV * aspectRatio;
    worldCoord *= uZoom;
    worldCoord += uOffset;

    vec2 cellPos = worldCoord / uCellSize;
    vec2 cellId = floor(cellPos);

    float cellIndex = mod(cellId.x + cellId.y * uGridColumns, uTextureCount);

    float atlasSize = ceil(sqrt(uTextureCount));
    vec2 atlasPos = vec2(mod(cellIndex, atlasSize), floor(cellIndex / atlasSize));

    vec2 cellUV = fract(cellPos);
    cellUV.y = 1.0 - cellUV.y;  // Инверсия по вертикали

    vec2 atlasUV = (atlasPos + cellUV) / atlasSize;

// Получаем цвет из текстуры
vec4 color = texture2D(uImageAtlas, atlasUV);

// Ширина рамки
float lineWidth = 0.09;

// Создаем маску рамки: 1 на границе клетки, 0 внутри
float borderX = step(cellUV.x, lineWidth) + step(1.0 - cellUV.x, lineWidth);
float borderY = step(cellUV.y, lineWidth) + step(1.0 - cellUV.y, lineWidth);
float borderMask = clamp(borderX + borderY, 0.0, 1.0);

// Смешиваем цвет рамки поверх изображения
color.rgb = mix(color.rgb, uBorderColor.rgb, borderMask * uBorderColor.a);

    float fade = 1.0 - smoothstep(1.2, 1.8, radius);

    gl_FragColor = vec4(color.rgb * fade, 1.0);
}


`