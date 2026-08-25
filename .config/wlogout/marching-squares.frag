// Marching Squares Contour Lines — GLSL port of WaveBackground.tsx
// Usage: shaderbg '*' marching-squares.frag
//
// Color controls (edit these):
#define BG_R 0.118
#define BG_G 0.118
#define BG_B 0.180
#define AC_R 0.537
#define AC_G 0.706
#define AC_B 0.980

#define GRID 1.0
#define INV_RANGE 0.454545454545455 // 1/2.2

// Distance from point p to line segment a->b
float segDist(vec2 p, vec2 a, vec2 b) {
    vec2 ab = b - a;
    float t = clamp(dot(p - a, ab) / dot(ab, ab), 0.0, 1.0);
    return length(p - (a + t * ab));
}

// Compute scalar field at grid coordinate (i, j)
// Matches the original: xComp + yComp + diagonal, scaled by 1/2.2
float fieldAt(float i, float j, float tfA, float tfB) {
    float gx = i * GRID;
    float gy = j * GRID;
    float xComp = 0.5 * (sin(gx * 0.007 + tfA) + sin(gx * 0.013 + tfA));
    float yComp = 0.5 * (sin(gy * 0.011 + tfA) + sin(gy * 0.017 + tfA));
    float diag  = sin(gx * 0.008 + gy * 0.008 + tfB);
    return (xComp + yComp + diag) * INV_RANGE;
}

void mainImage(out vec4 O, in vec2 F) {
    vec2 res = iResolution.xy;
    // Y-flip: canvas has top-left origin, shader has bottom-left
    vec2 uv = vec2(F.x, res.y - F.y) / res;

    vec2 gridRes = res / GRID;
    vec2 cell = floor(uv * gridRes);
    vec2 local = fract(uv * gridRes);

    float tf  = iTime * 0.7;
    float tfA = tf * 0.01;
    float tfB = tf * 0.8;

    // Field at four cell corners (top-left origin, y-down)
    float v1 = fieldAt(cell.x,     cell.y,     tfA, tfB);
    float v2 = fieldAt(cell.x + 1.0, cell.y,     tfA, tfB);
    float v3 = fieldAt(cell.x + 1.0, cell.y + 1.0, tfA, tfB);
    float v4 = fieldAt(cell.x,     cell.y + 1.0, tfA, tfB);

    // Six contour levels matching the original
    float levels[6];
    levels[0] = -1.2;
    levels[1] = -0.8;
    levels[2] = -0.2;
    levels[3] =  0.2;
    levels[4] =  0.8;
    levels[5] =  1.2;

    vec3 bg     = vec3(BG_R, BG_G, BG_B);
    vec3 accent = vec3(AC_R, AC_G, AC_B);
    vec3 col = bg;
    float lw = 2.0 / GRID;

    for (int li = 0; li < 6; li++) {
        float lv = levels[li];

        // Marching squares case index
        int ci = 0;
        if (v1 > lv) ci |= 1;
        if (v2 > lv) ci |= 2;
        if (v3 > lv) ci |= 4;
        if (v4 > lv) ci |= 8;
        if (ci == 0 || ci == 15) continue;

        // Edge interpolation factors (clamped to prevent overshoot)
        float tT = clamp((lv - v1) / (v2 - v1), 0.0, 1.0);
        float tR = clamp((lv - v2) / (v3 - v2), 0.0, 1.0);
        float tB = clamp((lv - v4) / (v3 - v4), 0.0, 1.0);
        float tL = clamp((lv - v1) / (v4 - v1), 0.0, 1.0);

        // Edge points in local [0,1] cell space
        vec2 pT = vec2(tT, 0.0);
        vec2 pR = vec2(1.0, tR);
        vec2 pB = vec2(tB, 1.0);
        vec2 pL = vec2(0.0, tL);

        float d = 1e10;

        // 14 marching squares cases (0 and 15 skipped above)
        if (ci == 1  || ci == 14) { d = min(d, segDist(local, pL, pT)); }
        if (ci == 2  || ci == 13) { d = min(d, segDist(local, pT, pR)); }
        if (ci == 3  || ci == 12) { d = min(d, segDist(local, pL, pR)); }
        if (ci == 4  || ci == 11) { d = min(d, segDist(local, pR, pB)); }
        if (ci == 5)              { d = min(d, segDist(local, pL, pT));
                                    d = min(d, segDist(local, pR, pB)); }
        if (ci == 6  || ci == 9)  { d = min(d, segDist(local, pT, pB)); }
        if (ci == 7  || ci == 8)  { d = min(d, segDist(local, pL, pB)); }
        if (ci == 10)             { d = min(d, segDist(local, pT, pR));
                                    d = min(d, segDist(local, pL, pB)); }

        if (d < lw) col = accent;
    }

    O = vec4(col, 1.0);
}
