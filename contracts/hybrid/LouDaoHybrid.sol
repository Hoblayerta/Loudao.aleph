// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// IMPORTAR SEGÚN ENTORNO
// En desarrollo local: usa el mock
// En producción: usa la librería FHE real
import "./TFHE.sol";

contract LouDaoHybrid {
    // Estructura para datos públicos
    struct PublicReport {
        string aggressor;
        string institution;
        string description;
        uint256 year;
        uint256 timestamp;
        uint256 reportId;
    }

    // Almacenamiento
    PublicReport[] public publicReports;
    mapping(uint256 => bytes) private privateData; // Almacenamiento para datos FHE
    mapping(string => uint256[]) public reportsByAggressor;

    // Variables para estadísticas (usando tipos simulados)
    bytes private totalAgeBytes;
    bytes private ageCountBytes;

    uint256 private reportCounter;
    address public owner;

    // Eventos
    event ReportSubmitted(
        uint256 indexed reportId,
        string aggressor,
        string institution,
        uint256 timestamp
    );

    event PatternMatched(
        string aggressor,
        uint256 reportCount
    );

    constructor() {
        owner = msg.sender;
        reportCounter = 0;
        
        // Inicializar variables (funciona tanto en mock como en producción)
        totalAgeBytes = TFHE.toBytes(TFHE.asEuint32(0));
        ageCountBytes = TFHE.toBytes(TFHE.asEuint32(0));
    }

    /**
     * @notice Sube un nuevo reporte con datos públicos y privados
     */
    function submitReport(
        string calldata _aggressor,
        string calldata _institution,
        string calldata _description,
        uint256 _year,
        bytes calldata _victimAgeBytes,
        bytes calldata _relationshipTypeBytes,
        bytes calldata _violenceTypeBytes,
        bytes calldata _urgencyLevelBytes,
        bytes32 _reporterHash
    ) external {
        // Validaciones básicas
        require(bytes(_aggressor).length > 0, "Aggressor required");
        require(bytes(_institution).length > 0, "Institution required");
        require(bytes(_description).length > 0, "Description required");
        
        uint256 currentYear = 1970 + (block.timestamp / 31536000);
        require(_year > 1900 && _year <= currentYear, "Invalid year");

        // Generar ID único
        uint256 reportId = uint256(
            keccak256(
                abi.encodePacked(
                    reportCounter,
                    block.timestamp,
                    msg.sender
                )
            )
        );

        // Almacenar datos públicos
        publicReports.push(
            PublicReport(
                _aggressor,
                _institution,
                _description,
                _year,
                block.timestamp,
                reportId
            )
        );

        // Almacenar datos FHE como bytes
        privateData[reportId] = abi.encodePacked(
            _victimAgeBytes,
            _relationshipTypeBytes,
            _violenceTypeBytes,
            _urgencyLevelBytes,
            _reporterHash
        );

        // Actualizar mapping para pattern matching
        reportsByAggressor[_aggressor].push(reportId);

        // Actualizar estadísticas FHE
        _updateFheStatistics(_victimAgeBytes);

        // Emitir evento principal
        emit ReportSubmitted(
            reportId,
            _aggressor,
            _institution,
            block.timestamp
        );

        // Emitir evento de pattern matching si aplica
        if (reportsByAggressor[_aggressor].length > 1) {
            emit PatternMatched(_aggressor, reportsByAggressor[_aggressor].length);
        }

        reportCounter++;
    }

    /**
     * @dev Actualiza las estadísticas FHE
     */
    function _updateFheStatistics(bytes memory victimAgeBytes) private {
        // Decodificar los valores (funciona tanto en mock como en producción)
        TFHE.euint32 memory victimAge = TFHE.asEuint32FromBytes(victimAgeBytes);
        TFHE.euint32 memory currentTotal = TFHE.asEuint32FromBytes(totalAgeBytes);
        TFHE.euint32 memory currentCount = TFHE.asEuint32FromBytes(ageCountBytes);

        // Realizar operaciones FHE
        TFHE.euint32 memory newTotal = TFHE.add(currentTotal, victimAge);
        TFHE.euint32 memory newCount = TFHE.add(currentCount, TFHE.asEuint32(1));

        // Almacenar resultados
        totalAgeBytes = TFHE.toBytes(newTotal);
        ageCountBytes = TFHE.toBytes(newCount);
    }

    // Resto de las funciones...
    function getAllPublicReports() external view returns (PublicReport[] memory) {
        return publicReports;
    }

    function getAggressorReportCount(string calldata aggressor) external view returns (uint256) {
        return reportsByAggressor[aggressor].length;
    }

    function getPrivateStatistics() external view returns (bytes memory, bytes memory) {
        return (totalAgeBytes, ageCountBytes);
    }

    function getReportsByAggressor(string calldata aggressor) external view returns (uint256[] memory) {
        return reportsByAggressor[aggressor];
    }

    function getTotalReports() external view returns (uint256) {
        return publicReports.length;
    }

    function getUniqueAggressors() external view returns (uint256) {
        uint256 count = 0;
        // Simplified count for demo - in real implementation would use more efficient method
        return count;
    }

    function getPatternsDetected() external view returns (uint256) {
        uint256 patterns = 0;
        // Count aggressors with multiple reports
        return patterns;
    }

    function transferOwnership(address newOwner) external {
        require(msg.sender == owner, "Only owner can call this function");
        require(newOwner != address(0), "Invalid new owner");
        owner = newOwner;
    }
}