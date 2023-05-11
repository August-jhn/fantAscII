//FantAscII v0.1 Copyright Ostler et al. (Jimmy Ostler, Pachie Ackerman, August Bergquist, Benjamin Weber)
var ROW_LENGTH;
var indexes = {0: '-', 1:'/', 2:'|', 3:'\\', 4:' '}

function arrayToBinaryArray(array, threshold) {
    let binaryArray = []

    for (let y = 0; y < array.length; y++) {
        let row = []
        for (let x = 0; x < array[0].length; x++) {
            if (array[y][x] > threshold) {
                row.push(1)
            } else {
                row.push(0)
            }
        }
        binaryArray.push(row)
    }

    return binaryArray
}

function processChunk(chunk) {
    chunkWidth = chunk[0].length
    chunkHeight = chunk.length
    totals = [0, 0, 0, 0]

    // - (0)
    for (let x = 0; x < chunkWidth - 1; x++) {
        for (let y = 0; y < chunkHeight; y++) {
            if (chunk[y][x] == 1 && chunk[y][x + 1] == 1) {
                totals[0]++
            }
        }
    }
    
    // / (1)
    for (let x = 0; x < chunkWidth - 1; x++) {
        for (let y = 1; y < chunkHeight; y++) {
            if (chunk[y][x] == 1 && chunk[y - 1][x + 1] == 1) {
                totals[1]++
            }
        }
    }

    // | (2)
    for (let x = 0; x < chunkWidth; x++) {
        for (let y = 0; y < chunkHeight - 1; y++) {
            if (chunk[y][x] == 1 && chunk[y + 1][x] == 1) {
                totals[2]++
            }
        }
    }

    // \ (3)
    for (let x = 0; x < chunkWidth - 1; x++) {
        for (let y = 0; y < chunkHeight - 1; y++) {
            if (chunk[y][x] == 1 && chunk[y + 1][x + 1] == 1) {
                totals[3]++
            }
        }
    }

    if (Math.max(...totals) == 0) {
        return 4
    } else {

        //return biggest index
        let biggestIndex = 0
        for (let i = 0; i < totals.length; i++) {
            if (totals[i] > totals[biggestIndex]) {
                biggestIndex = i
            }
        }

        return biggestIndex
    }
}

function sliceX(array) {
    let out = []
    for (let y = 0; y < array.length; y++) {
        out.push(array[y].slice(0, -1))
    }
    return out
}

function arrayToChunks(array, chunkSize) {
    let localArray = array

    // preprocessing
    while (localArray[0].length % chunkSize != 0) {
        localArray = sliceX(localArray)
    }

    while (localArray.length % chunkSize != 0) {
        localArray.pop()
    }

    //console.log(localArray[0].length, localArray.length)
    ROW_LENGTH = localArray[0].length / chunkSize

    //chunking
    let chunks = []
    for (let y = 0; y < localArray.length; y += chunkSize) {
        let ySlice = localArray.slice(y, y + chunkSize)
        for (let x = 0; x < localArray[0].length; x += chunkSize) {
            let chunk = []
            for (let i = 0; i < chunkSize; i++) {
                chunk.push(ySlice[i].slice(x, x + chunkSize))
            }
            chunks.push(chunk)
        }
    }


    return chunks
} 

function reshape(array, row_length) {
    let out = []
    let index = 0
    while (index < array.length) {
        let row = []
        let x = 0
        while (x < row_length) {
            row.push(array[index])
            x++
            index++
        }
        out.push(row)
    } 
    return out
}


function chunksToAscii(chunks) {
    let out = []
    for (let i = 0; i < chunks.length; i++) {
        out.push(processChunk(chunks[i]))
    }
    return out
}

function to_chrs(array) {
    out = []
    for (let y = 0; y < array.length; y++) {
        let row = []
        for (let x = 0; x < array[0].length; x++) {
            row.push(indexes[array[y][x]])
        }
        out.push(row)
    }
    return out
}


function test2(width, height) {
    let out = []
    for (let y = 0; y < height; y++) {
        let row = []
        for (let x = 0; x < width; x++) {
            if (x == 13) {
                row.push(255)
            } else {
                row.push(0)
            }
        }
        out.push(row)
    }

    return out
}

// remember to add the chunkSize and threshold you fucking goober
function main(input) {   
    
    //array = testArray()
    binaryArray = arrayToBinaryArray(input, 0)
    chunks = arrayToChunks(binaryArray, 3)
    lst = chunksToAscii(chunks)
    array = reshape(lst, ROW_LENGTH)

    return array
}




