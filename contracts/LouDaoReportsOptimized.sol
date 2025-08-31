// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// MOCK PARA DESARROLLO LOCAL EN REMIX
library TFHE {
    struct euint32 {
        uint32 value;
    }

    function asEuint32(uint32 x) internal pure returns (euint32 memory) {
        return euint32(x);
    }

    function add(euint32 memory a, euint32 memory b) internal pure returns (euint32 memory) {
        return euint32(a.value + b.value);
    }

    function toBytes(euint32 memory x) internal pure returns (bytes memory) {
        return abi.encode(x.value);
    }

    function asEuint32FromBytes(bytes memory data) internal pure returns (euint32 memory) {
        uint32 value = abi.decode(data, (uint32));
        return euint32(value);
    }
}

contract LouDaoReports {
    struct PublicReport {
        string aggressor;
        string institution;
        string description;
        uint256 year;
        uint256 timestamp;
        uint256 reportId;
    }

    PublicReport[] public publicReports;
    mapping(uint256 => bytes) private privateData;
    mapping(string => uint256[]) public reportsByAggressor;

    bytes private totalAgeBytes;
    bytes private ageCountBytes;
    uint256 private reportCounter;
    address public owner;

    event ReportSubmitted(uint256 indexed reportId, string aggressor, string institution, uint256 timestamp);
    event PatternMatched(string aggressor, uint256 reportCount);

    constructor() {
        owner = msg.sender;
        reportCounter = 0;
        totalAgeBytes = TFHE.toBytes(TFHE.asEuint32(0));
        ageCountBytes = TFHE.toBytes(TFHE.asEuint32(0));
    }

    function submitReport(
        string calldata _aggressor,
        string calldata _institution,
        string calldata _description,
        uint256 _year,
        bytes calldata _victimAgeBytes,
        bytes calldata _relationshipTypeBytes,
        bytes calldata _violenceTypeBytes,
        bytes calldata _urgencyLevelBytes
    ) external {
        require(bytes(_aggressor).length > 0, "Aggressor required");
        require(bytes(_institution).length > 0, "Institution required");
        require(bytes(_description).length > 0, "Description required");
        
        uint256 currentYear = 1970 + (block.timestamp / 31536000);
        require(_year > 1900 && _year <= currentYear, "Invalid year");

        // Usar hash para generar ID único
        uint256 reportId = uint256(keccak256(abi.encodePacked(reportCounter, block.timestamp, msg.sender)));

        // Almacenar datos públicos
        publicReports.push(PublicReport(_aggressor, _institution, _description, _year, block.timestamp, reportId));

        // Almacenar datos privados
        privateData[reportId] = abi.encodePacked(_victimAgeBytes, _relationshipTypeBytes, _violenceTypeBytes, _urgencyLevelBytes);

        // Actualizar tracking
        reportsByAggressor[_aggressor].push(reportId);

        // Actualizar estadísticas FHE
        _updateStats(_victimAgeBytes);

        // Eventos
        emit ReportSubmitted(reportId, _aggressor, _institution, block.timestamp);

        if (reportsByAggressor[_aggressor].length > 1) {
            emit PatternMatched(_aggressor, reportsByAggressor[_aggressor].length);
        }

        reportCounter++;
    }

    function _updateStats(bytes memory victimAgeBytes) private {
        TFHE.euint32 memory victimAge = TFHE.asEuint32FromBytes(victimAgeBytes);
        TFHE.euint32 memory currentTotal = TFHE.asEuint32FromBytes(totalAgeBytes);
        TFHE.euint32 memory currentCount = TFHE.asEuint32FromBytes(ageCountBytes);

        TFHE.euint32 memory newTotal = TFHE.add(currentTotal, victimAge);
        TFHE.euint32 memory newCount = TFHE.add(currentCount, TFHE.asEuint32(1));

        totalAgeBytes = TFHE.toBytes(newTotal);
        ageCountBytes = TFHE.toBytes(newCount);
    }

    function getAllReports() external view returns (PublicReport[] memory) {
        return publicReports;
    }

    function getAggressorReportCount(string calldata aggressor) external view returns (uint256) {
        return reportsByAggressor[aggressor].length;
    }

    function getTotalReports() external view returns (uint256) {
        return publicReports.length;
    }

    function getUniqueAggressors() external view returns (uint256) {
        return reportCounter; // Simplified
    }

    function getPatternsDetected() external view returns (uint256) {
        return 0; // Simplified
    }

    function getReport(uint256 _reportId) external view returns (
        uint256 id,
        string memory aggressorName,
        string memory institution,
        string memory description,
        uint256 incidentYear,
        string memory city,
        address reporter,
        uint256 timestamp,
        bool isActive
    ) {
        require(_reportId < publicReports.length, "Invalid report ID");
        PublicReport memory report = publicReports[_reportId];
        return (
            report.reportId,
            report.aggressor,
            report.institution,
            report.description,
            report.year,
            "",
            owner,
            report.timestamp,
            true
        );
    }

    function getPrivateStatistics() external view returns (bytes memory, bytes memory) {
        return (totalAgeBytes, ageCountBytes);
    }

    function getReportsByAggressor(string calldata aggressor) external view returns (uint256[] memory) {
        return reportsByAggressor[aggressor];
    }
}