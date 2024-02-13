const statusEquivalenceData = [
    {
      "status_anymarket": {
        "PENDING": ["AAP"],
        "PAID_WAITING_SHIP": ["ASE", "SEP", "ALS", "POK", "AES", "NFS"],
        "CANCELED": ["CAN", "I19", "I63", "RIE"],
        "CONCLUDED": ["ENT"],
        "INVOICED": ["NFS"],
        "PAID_WAITING_DELIVERY": ["I59", "I15", "I25", "I26", "I39", "ETR", "I11", "I48", "I10", "I22", "I20", "I64", "I24", "I23", "I37", "i62", "I33", "I70"]
      }
    }
  ];
  
const CheckStatusEquivalence = async (statusToCheckAnymarket, statusToCheckBseller) => {
    for (const data of statusEquivalenceData) {
      if (
        data.status_anymarket[statusToCheckAnymarket] &&
        data.status_anymarket[statusToCheckAnymarket].includes(statusToCheckBseller)
      ) {
        return true;
      }
    }
    return false;
  }
  
  module.exports = {
    CheckStatusEquivalence
  };