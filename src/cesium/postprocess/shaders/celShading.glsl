precision mediump float;

uniform sampler2D colorTexture;

uniform float levels;
uniform float intensity;

in vec2 v_textureCoordinates;

vec3 quantize(vec3 color, float steps) {
  return floor(color * steps) / steps;
}

void main() {
  vec4 sampleColor = texture(colorTexture, v_textureCoordinates);
  float steps = max(levels, 2.0);
  vec3 toonColor = quantize(sampleColor.rgb, steps);

  vec3 mixed = mix(sampleColor.rgb, toonColor, clamp(intensity, 0.0, 1.0));

  out_FragColor = vec4(mixed, sampleColor.a);
}
