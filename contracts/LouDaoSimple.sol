// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

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

    uint256 private reportCounter;
    address public owner;

    event ReportSubmitted(uint256 indexed reportId, string aggressor, string institution, uint256 timestamp);
    event PatternMatched(string aggressor, uint256 reportCount);

    constructor() {
        owner = msg.sender;
        reportCounter = 0;
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
        require(_year > 1900 && _year <= 2024, "Invalid year");

        uint256 reportId = reportCounter + 1;

        // Crear el struct paso a paso para evitar stack overflow
        PublicReport memory newReport;
        newReport.aggressor = _aggressor;
        newReport.institution = _institution;
        newReport.description = _description;
        newReport.year = _year;
        newReport.timestamp = block.timestamp;
        newReport.reportId = reportId;

        publicReports.push(newReport);

        // Almacenar datos privados
        privateData[reportId] = abi.encodePacked(
            _victimAgeBytes, 
            _relationshipTypeBytes, 
            _violenceTypeBytes, 
            _urgencyLevelBytes
        );

        // Actualizar tracking
        reportsByAggressor[_aggressor].push(reportId);

        // Eventos
        emit ReportSubmitted(reportId, _aggressor, _institution, block.timestamp);

        if (reportsByAggressor[_aggressor].length > 1) {
            emit PatternMatched(_aggressor, reportsByAggressor[_aggressor].length);
        }

        reportCounter++;
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
        return reportCounter;
    }

    function getPatternsDetected() external view returns (uint256) {
        return 0;
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

    function getReportsByAggressor(string calldata aggressor) external view returns (uint256[] memory) {
        return reportsByAggressor[aggressor];
    }
}