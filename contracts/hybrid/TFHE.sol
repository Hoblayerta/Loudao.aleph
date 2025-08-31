// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// MOCK PARA DESARROLLO LOCAL EN REMIX
// Este archivo simula la librería FHE para compilación y pruebas

library TFHE {
    // Tipos simulados (en producción serían tipos FHE reales)
    struct euint8 {
        uint8 value;
    }
    
    struct euint32 {
        uint32 value;
    }

    // Funciones de creación
    function asEuint8(uint8 x) internal pure returns (euint8 memory) {
        return euint8(x);
    }
    
    function asEuint32(uint32 x) internal pure returns (euint32 memory) {
        return euint32(x);
    }

    // Operaciones básicas
    function add(euint32 memory a, euint32 memory b) internal pure returns (euint32 memory) {
        return euint32(a.value + b.value);
    }
    
    function add(euint8 memory a, euint8 memory b) internal pure returns (euint8 memory) {
        return euint8(a.value + b.value);
    }

    // Conversión a bytes para almacenamiento
    function toBytes(euint32 memory x) internal pure returns (bytes memory) {
        return abi.encode(x.value);
    }
    
    function toBytes(euint8 memory x) internal pure returns (bytes memory) {
        return abi.encode(x.value);
    }

    // Conversión desde bytes
    function asEuint32FromBytes(bytes memory data) internal pure returns (euint32 memory) {
        uint32 value = abi.decode(data, (uint32));
        return euint32(value);
    }
    
    function asEuint8FromBytes(bytes memory data) internal pure returns (euint8 memory) {
        uint8 value = abi.decode(data, (uint8));
        return euint8(value);
    }
}