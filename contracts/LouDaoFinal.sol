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
    }

    function submitReport(
        string memory _aggressor,
        string memory _institution,
        string memory _description,
        uint256 _year,
        bytes memory _victimAgeBytes,
        bytes memory _relationshipTypeBytes,
        bytes memory _violenceTypeBytes,
        bytes memory _urgencyLevelBytes
    ) external {
        require(bytes(_aggressor).length > 0, "Aggressor required");
        require(bytes(_institution).length > 0, "Institution required");
        require(_year > 1900 && _year <= 2024, "Invalid year");

        reportCounter++;
        
        publicReports.push(PublicReport({
            aggressor: _aggressor,
            institution: _institution,
            description: _description,
            year: _year,
            timestamp: block.timestamp,
            reportId: reportCounter
        }));

        privateData[reportCounter] = abi.encodePacked(_victimAgeBytes, _relationshipTypeBytes, _violenceTypeBytes, _urgencyLevelBytes);
        reportsByAggressor[_aggressor].push(reportCounter);

        emit ReportSubmitted(reportCounter, _aggressor, _institution, block.timestamp);

        if (reportsByAggressor[_aggressor].length > 1) {
            emit PatternMatched(_aggressor, reportsByAggressor[_aggressor].length);
        }
    }

    function getAllReports() external view returns (PublicReport[] memory) {
        return publicReports;
    }

    function getAggressorReportCount(string memory aggressor) external view returns (uint256) {
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
        require(_reportId > 0 && _reportId <= reportCounter, "Invalid report ID");
        PublicReport memory report = publicReports[_reportId - 1];
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

    function getReportsByAggressor(string memory aggressor) external view returns (uint256[] memory) {
        return reportsByAggressor[aggressor];
    }
}