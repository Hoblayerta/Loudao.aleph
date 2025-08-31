// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@fhevm/solidity/contracts/FHE.sol";

contract LouDaoReports {
    using FHE for *;

    struct PublicReport {
        uint256 id;
        string aggressorName;
        string institution;
        string description;
        uint256 incidentYear;
        string city;
        address reporter;
        uint256 timestamp;
        bool isActive;
    }

    struct PrivateData {
        euint32 victimAge;      // Encrypted age range (1-5)
        euint32 relationshipType; // Encrypted relationship type (1-6)
        euint32 violenceType;   // Encrypted violence type (1-5)
        euint32 urgencyLevel;   // Encrypted urgency level (1-5)
    }

    mapping(uint256 => PublicReport) public reports;
    mapping(uint256 => PrivateData) private encryptedData;
    mapping(string => uint256[]) public aggressorReports; // Track multiple reports per aggressor
    
    uint256 public reportCount;
    uint256 public constant PATTERN_THRESHOLD = 2; // Minimum reports to flag pattern

    event ReportSubmitted(
        uint256 indexed reportId,
        string indexed aggressorName,
        string institution,
        address reporter,
        uint256 timestamp
    );

    event PatternDetected(
        string indexed aggressorName,
        uint256 reportCount,
        uint256 timestamp
    );

    modifier validReport(
        string memory _aggressorName,
        string memory _institution,
        string memory _description,
        uint256 _incidentYear
    ) {
        require(bytes(_aggressorName).length > 0, "Aggressor name required");
        require(bytes(_institution).length > 0, "Institution required");
        require(bytes(_description).length > 0, "Description required");
        require(_incidentYear >= 2020 && _incidentYear <= 2024, "Invalid year");
        _;
    }

    function submitReport(
        string memory _aggressorName,
        string memory _institution,
        string memory _description,
        uint256 _incidentYear,
        string memory _city,
        bytes memory _encryptedVictimAge,
        bytes memory _encryptedRelationshipType,
        bytes memory _encryptedViolenceType,
        bytes memory _encryptedUrgencyLevel
    ) 
        public 
        validReport(_aggressorName, _institution, _description, _incidentYear)
    {
        reportCount++;
        
        // Store public data
        reports[reportCount] = PublicReport({
            id: reportCount,
            aggressorName: _aggressorName,
            institution: _institution,
            description: _description,
            incidentYear: _incidentYear,
            city: _city,
            reporter: msg.sender,
            timestamp: block.timestamp,
            isActive: true
        });

        // Store encrypted private data
        encryptedData[reportCount] = PrivateData({
            victimAge: FHE.asEuint32(_encryptedVictimAge),
            relationshipType: FHE.asEuint32(_encryptedRelationshipType),
            violenceType: FHE.asEuint32(_encryptedViolenceType),
            urgencyLevel: FHE.asEuint32(_encryptedUrgencyLevel)
        });

        // Track reports per aggressor for pattern detection
        aggressorReports[_aggressorName].push(reportCount);
        
        emit ReportSubmitted(
            reportCount,
            _aggressorName,
            _institution,
            msg.sender,
            block.timestamp
        );

        // Check for patterns
        if (aggressorReports[_aggressorName].length >= PATTERN_THRESHOLD) {
            emit PatternDetected(
                _aggressorName,
                aggressorReports[_aggressorName].length,
                block.timestamp
            );
        }
    }

    function getReport(uint256 _reportId) 
        public 
        view 
        returns (PublicReport memory) 
    {
        require(_reportId > 0 && _reportId <= reportCount, "Invalid report ID");
        require(reports[_reportId].isActive, "Report not active");
        return reports[_reportId];
    }

    function getAggressorReportCount(string memory _aggressorName) 
        public 
        view 
        returns (uint256) 
    {
        return aggressorReports[_aggressorName].length;
    }

    function getAllReports() 
        public 
        view 
        returns (PublicReport[] memory) 
    {
        PublicReport[] memory activeReports = new PublicReport[](reportCount);
        uint256 activeCount = 0;

        for (uint256 i = 1; i <= reportCount; i++) {
            if (reports[i].isActive) {
                activeReports[activeCount] = reports[i];
                activeCount++;
            }
        }

        // Resize array to actual active count
        PublicReport[] memory result = new PublicReport[](activeCount);
        for (uint256 i = 0; i < activeCount; i++) {
            result[i] = activeReports[i];
        }

        return result;
    }

    // Analytics functions using FHE
    function getEncryptedAverageAge() 
        public 
        view 
        returns (bytes memory) 
    {
        if (reportCount == 0) {
            return FHE.encrypt32(0);
        }

        euint32 sum = FHE.asEuint32(0);
        for (uint256 i = 1; i <= reportCount; i++) {
            if (reports[i].isActive) {
                sum = sum.add(encryptedData[i].victimAge);
            }
        }
        
        euint32 average = sum.div(FHE.asEuint32(reportCount));
        return FHE.encrypt32(FHE.decrypt(average));
    }

    function getEncryptedViolenceTypeDistribution(uint32 _violenceType) 
        public 
        view 
        returns (bytes memory) 
    {
        euint32 count = FHE.asEuint32(0);
        euint32 targetType = FHE.asEuint32(_violenceType);

        for (uint256 i = 1; i <= reportCount; i++) {
            if (reports[i].isActive) {
                ebool isMatch = encryptedData[i].violenceType.eq(targetType);
                count = count.add(FHE.select(isMatch, FHE.asEuint32(1), FHE.asEuint32(0)));
            }
        }

        return FHE.encrypt32(FHE.decrypt(count));
    }

    function getTotalReports() public view returns (uint256) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= reportCount; i++) {
            if (reports[i].isActive) {
                activeCount++;
            }
        }
        return activeCount;
    }

    function getUniqueAggressors() public view returns (uint256) {
        // This is a simplified count - in practice, you'd track unique aggressors more efficiently
        return reportCount; // Placeholder
    }

    function getPatternsDetected() public view returns (uint256) {
        uint256 patterns = 0;
        // This would be implemented with a more sophisticated tracking system
        return patterns; // Placeholder
    }
}
