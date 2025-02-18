// frontend/src/utils/dashboardHelpers.js

export const calculateSexDistribution = (members) => {
    if (!members || members.length === 0) {
      return { Male: 0, Female: 0, Other: 0 };
    }
    const distribution = { Male: 0, Female: 0, Other: 0 };
    members.forEach(member => {
      if (member && member.sex && distribution.hasOwnProperty(member.sex)) {
        distribution[member.sex]++;
      }
    });
    return distribution;
  };

  export const calculateLocationDistribution = (members) => {
    if (!members || members.length === 0) {
      return {};
    }
    const distribution = {};
    members.forEach(member => {
      if (member && member.location) {
        distribution[member.location] = (distribution[member.location] || 0) + 1;
      }
    });
    return distribution;
  };

  export const calculateWorkStatusDistribution = (members) => {
    if (!members || members.length === 0) {
      return {};
    }
    const distribution = {};
    members.forEach(member => {
      if (member && member.workStatus) {
        distribution[member.workStatus] = (distribution[member.workStatus] || 0) + 1;
      }
    });
    return distribution;
  };

  export const calculateAverageAge = (members) => {
    if (!members || members.length === 0) {
      return 0;
    }
    let totalAge = 0;
      let validMemberCount = 0; // Keep track of members with valid ages
      members.forEach(member => {
          if (member && typeof member.age === 'number') { // Check for valid number
              totalAge += member.age;
              validMemberCount++;
          }
      });

      if (validMemberCount === 0) {
          return 0; // Avoid division by zero
      }

      return (totalAge / validMemberCount).toFixed(1);
  };

  export const calculateFamilyStatusDistribution = (members) => {
      if (!members || members.length === 0) {
          return { Family: 0, Individual: 0 };
      }
    const distribution = { Family: 0, Individual: 0 };
    members.forEach(member => {
        if (member && typeof member.isFamily === 'number') {
            if (member.isFamily === 1) {
                distribution.Family++;
            } else {
                distribution.Individual++;
            }
        }
    });
    return distribution;
  };

  export const calculateTunisianCityDistribution = (members) => {
      if (!members || members.length === 0) {
          return {};
      }
    const distribution = {};
    members.forEach(member => {
      if(member && member.tunisianCity){
          distribution[member.tunisianCity] = (distribution[member.tunisianCity] || 0) + 1;
      }
    });
    return distribution;
  };
