<template>
    <div>
        <v-container>
            <v-row>
                <v-col :cols="12">
                    <v-alert
                        outlined
                        type="success"
                        text
                    >
                        普莱菲尔密码
                    </v-alert>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-icon color="green">
                            mdi-information
                        </v-icon>
                        重要提示：
                        <ul>
                            <li>纯前端实现，无服务器交互</li>
                        </ul>
                    </v-card-text>
                    <v-divider></v-divider>
                </v-col>
                <v-col :cols="12">
                    <v-radio-group v-model="dst_type" row>
                        <v-radio
                            label="加密"
                            value="encode"
                        ></v-radio>
                        <v-radio
                            label="解密"
                            value="decode"
                        ></v-radio>
                    </v-radio-group>
                </v-col>
                <v-col :cols="12">
                    <v-btn color="primary" @click="switchTo">切换加密/解密</v-btn>
                </v-col>
                <v-col :cols="12">
                    <v-text-field
                        label="密钥"
                        v-model="key"
                    ></v-text-field>
                </v-col>
                <v-col :cols="12">
                    <v-card-text>
                        <v-textarea
                            v-model="src"
                            label="输入文本"
                            outlined
                            rows="10"
                        ></v-textarea>
                    </v-card-text>
                    <v-divider></v-divider>
                </v-col>
                <v-col :cols="12">
                    <v-card-text>
                        <v-textarea
                            v-model="dst"
                            label="结果"
                            outlined
                            rows="10"
                        ></v-textarea>
                    </v-card-text>
                    <v-divider></v-divider>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
function generateMatrix(key) {
  const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
  const used = new Set();
  const matrix = [];

  for (const char of key.toUpperCase()) {
    if (char === "J") continue;
    if (!used.has(char)) {
      matrix.push(char);
      used.add(char);
    }
  }

  for (const char of alphabet) {
    if (!used.has(char)) {
      matrix.push(char);
      used.add(char);
    }
  }

  return matrix.reduce((rows, key, index) => {
    if (index % 5 === 0) rows.push([]);
    rows[rows.length - 1].push(key);
    return rows;
  }, []);
}

function prepareText(text) {
  return text
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");
}

function chunkText(text) {
  const textPairs = [];

  for (let i = 0; i < text.length; i += 2) {
    let first = text[i];
    let second = text[i + 1] || "X";

    if (first === second) {
      second = "X";
      i--;
    }

    textPairs.push([first, second]);
  }

  return textPairs;
}

function getMatrixCoordinates(matrix, char) {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (matrix[row][col] === char) {
        return { row, col };
      }
    }
  }

  return null;
}

function playfairCipher(text, key, processPairFn) {
  const matrix = generateMatrix(key);
  const preparedText = prepareText(text);
  const textPairs = chunkText(preparedText);

  return textPairs
    .map(pair => processPairFn(pair, matrix))
    .flat()
    .join("");
}

function processEncryptPair(pair, matrix) {
  const [charA, charB] = pair;
  const coordA = getMatrixCoordinates(matrix, charA);
  const coordB = getMatrixCoordinates(matrix, charB);

  if (coordA.row === coordB.row) {
    return [
      matrix[coordA.row][(coordA.col + 1) % 5],
      matrix[coordB.row][(coordB.col + 1) % 5],
    ];
  } else if (coordA.col === coordB.col) {
    return [
      matrix[(coordA.row + 1) % 5][coordA.col],
      matrix[(coordB.row + 1) % 5][coordB.col],
    ];
  } else {
    return [
      matrix[coordA.row][coordB.col],
      matrix[coordB.row][coordA.col],
    ];
  }
}

function processDecryptPair(pair, matrix) {
  const [charA, charB] = pair;
  const coordA = getMatrixCoordinates(matrix, charA);
  const coordB = getMatrixCoordinates(matrix, charB);

  if (coordA.row === coordB.row) {
    return [
      matrix[coordA.row][(coordA.col + 4) % 5],
      matrix[coordB.row][(coordB.col + 4) % 5],
    ];
  } else if (coordA.col === coordB.col) {
    return [
      matrix[(coordA.row + 4) % 5][coordA.col],
      matrix[(coordB.row + 4)% 5][coordB.col],
    ];
  } else {
    return [
      matrix[coordA.row][coordB.col],
      matrix[coordB.row][coordA.col],
    ];
  }
}

export function playfairEncrypt(text, key) {
  return playfairCipher(text, key, processEncryptPair);
}

export function playfairDecrypt(text, key) {
  return playfairCipher(text, key, processDecryptPair);
}

export default {
  data: () => ({
    src: "",
    dst_type: "encode",
    key: "playfair",
  }),
  computed: {
    dst() {
      switch (this.dst_type) {
        case "encode":
          return playfairEncrypt(this.src, this.key);
        case "decode":
          return playfairDecrypt(this.src, this.key);
      }
      return "";
    },
  },
  methods: {
    switchTo() {
      switch (this.dst_type) {
        case "encode":
          this.src = this.dst;
          this.dst_type = "decode";
          break;
        case "decode":
          this.src = this.dst;
          this.dst_type = "encode";
          break;
      }
    },
  },
};
</script>
