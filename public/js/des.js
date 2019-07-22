var expansion_table = [
    31, 0, 1, 2, 3, 4,
    3, 4, 5, 6, 7, 8,
    7, 8, 9, 10, 11, 12,
    11, 12, 13, 14, 15, 16,
    15, 16, 17, 18, 19, 20,
    19, 20, 21, 22, 23, 24,
    23, 24, 25, 26, 27, 28,
    27, 28, 29, 30, 31, 0
]

var sbox = [
    [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
    [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
    [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
    [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
]

function textToBits(str){
    bin = ""
    for (var i = 0; i < str.length; i++) {
        var binchar = str.charCodeAt(i).toString(2)
        bin += '0'.repeat(8 - binchar.length) + binchar
    }
    return bin
}

function bitsToBlocks(plainText, nbit){
    var blocks = []
    var i = 0
    do{
        var binText = plainText.slice(i, i+nbit)
        blocks.push(binText + '0'.repeat(nbit-binText.length))
        i += nbit
    }while(i <= plainText.length)
    return blocks
}

function blocksToBits(blocks, nbit){
    var bits = ''
    for(var i = 0; i < blocks.length; i++){
        bits += blocks[i]
    }
    return bits
}

function bitsToText(bits){
    var text = ''
    for(var i = 0; i < bits.length; i += 8){
        text += String.fromCharCode(parseInt(bits.slice(i, i+8), 2))
    }
    return text
}

function des(plain_text){
    plain_bits = textToBits(plain_text)
    var blocks = bitsToBlocks(plain_bits, nbit=64)
    for(var i = 0; i < blocks.length; i++){
        for(var j = 0; j < 16; j++){
            blocks[i] = round(blocks[i])
        }
    }
    chiper_bits = blocksToBits(blocks, nbit=64)
    chiper_text = bitsToText(chiper_bits)
    return chiper_text
}

function round(block, round_key){
    var left32bits = block.slice(0, 32)
    var right32bits = block.slice(32, 64)
    var fresult = ffunction(right32bits, round_key)
    var temp = XOR(fresult, left32bits)
    left32bits = right32bits
    right32bits = temp
    return left32bits + right32bits
}

function ffunction(right32bits, round_key){
    var expanded_bits = expansion(right32bits)
    var xored_bits = XOR(expanded_bits, round_key)
    var sboxed_bits = substitute(sbox, xored_bits)
    return sboxed_bits
}

function substitute(sbox, xored_bits){
    var blocks = bitsToBlocks(xored_bits, nbit = 6)
    var sboxed_bits = ''
    for(var i = 0; i < blocks.length; i++){
        var row = parseInt(blocks[i][0] + blocks[i][5], 2)
        var col = parseInt(blocks.slice(1, 5), 2)
        sboxed_bits += sbox[row][col].toString(2)
    }
    return sboxed_bits
}

function XOR(A, B){
    var xor = ''
    for(var i = 0; i < A.length; i++){
        xor += A[i]^B[i]
    }
    return xor
}

function expansion(bit32){
    var bit48 = ''
    for(var i = 0; i < 32; i++){
        bit48.push(bit32[expansion_table[i]])
    }
    return bit48
}