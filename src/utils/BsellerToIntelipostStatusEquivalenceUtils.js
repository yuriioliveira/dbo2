const BsellerToIntelipostStatusEquivalence = [
  {
    "statusFromIntelipost": {
      "SHIPPED": ["I59", "RIE", "I15", "I25", "I26", "I39", "ETR", "I11", "I48", "I10", "I22", "I20", "I64", "I24", "I23", "I37", "i62", "I33", "I70", "NFS"],
      "TO_BE_DELIVERED": ["I59", "RIE", "I15", "I25", "I26", "I39", "ETR", "I11", "I48", "I10", "I22", "I20", "I64", "I24", "I23", "I37", "i62", "I33", "I70"],
      "IN_TRANSIT": ["I59", "RIE", "I15", "I25", "I26", "I39", "ETR", "I11", "I48", "I10", "I22", "I20", "I64", "I24", "I23", "I37", "i62", "I33", "I70"],
      "CREATED_AT_LOGISTIC_PROVIDER": ["I59", "RIE", "I15", "I25", "I26", "I39", "ETR", "I11", "I48", "I10", "I22", "I20", "I64", "I24", "I23", "I37", "i62", "I33", "I70"],
      "DELIVERED": ["ENT"],
      "CANCELLED": ["CAN", "I19", "I63"],
      "DELIVERY_FAILED": ["CAN", "I19", "I63"],
      "NEW": ["ASE", "SEP", "ALS", "POK", "AES", "AAP", "NFS"],
    }
  }
];

const BsellerToIntelipostCheckStatusEquivalence = async (status_intelipost, status_bseller) => {
  for (const data of BsellerToIntelipostStatusEquivalence) {
      if (
        data.statusFromIntelipost[status_intelipost] &&
        data.statusFromIntelipost[status_intelipost].includes(status_bseller)
      ) {
        return true;
      }
    }
    return false;
  }
  
module.exports = {
  BsellerToIntelipostCheckStatusEquivalence
};