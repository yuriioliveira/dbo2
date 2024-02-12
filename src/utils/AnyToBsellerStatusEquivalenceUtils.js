const statusEquivalenceData = [
    {
      "status_anymarket": {
        "PENDING": ["AAP"],
        "PAID_WAITING_SHIP": ["ASE", "SEP", "ALS", "POK", "AES"],
        "CANCELED": ["CAN", "I19", "I63", "RIE"],
        "CONCLUDED": ["ENT"],
        "INVOICED": ["NFS"],
        "PAID_WAITING_DELIVERY": ["I59", "I15", "I25", "I26", "I39", "ETR", "I11", "I48", "I10", "I22", "I20", "I64", "I24", "I23", "I37", "i62", "I33", "I70"]
      },
      "status_bseller": {
        "AAP": ["PENDING"],
        "ASE": ["PAID_WAITING_SHIP"],
        "SEP": ["PAID_WAITING_SHIP"],
        "ALS": ["PAID_WAITING_SHIP"],
        "POK": ["PAID_WAITING_SHIP"],
        "AES": ["PAID_WAITING_SHIP"],
        "CAN": ["CANCELED"],
        "ENT": ["CONCLUDED"],
        "NFS": ["INVOICED"],
        "I63": ["PAID_WAITING_DELIVERY"],
        "I59": ["PAID_WAITING_DELIVERY"],
        "RIE": ["PAID_WAITING_DELIVERY"],
        "I19": ["PAID_WAITING_DELIVERY"],
        "I15": ["PAID_WAITING_DELIVERY"],
        "I25": ["PAID_WAITING_DELIVERY"],
        "I26": ["PAID_WAITING_DELIVERY"],
        "I39": ["PAID_WAITING_DELIVERY"],
        "ETR": ["PAID_WAITING_DELIVERY"],
        "I11": ["PAID_WAITING_DELIVERY"],
        "I48": ["PAID_WAITING_DELIVERY"],
        "I10": ["PAID_WAITING_DELIVERY"],
        "I22": ["PAID_WAITING_DELIVERY"],
        "I20": ["PAID_WAITING_DELIVERY"],
        "I64": ["PAID_WAITING_DELIVERY"],
        "I24": ["PAID_WAITING_DELIVERY"],
        "I23": ["PAID_WAITING_DELIVERY"],
        "I37": ["PAID_WAITING_DELIVERY"],
        "i62": ["PAID_WAITING_DELIVERY"],
        "I33": ["PAID_WAITING_DELIVERY"],
        "I70": ["PAID_WAITING_DELIVERY"]
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