const BsellerToIntelipostStatusEquivalence = [
    {
      "statusFromIntelipost": {
        "SHIPPED": ["I59", "RIE", "I15", "I25", "I26", "I39", "ETR", "I11", "I48", "I10", "I22", "I20", "I64", "I24", "I23", "I37", "i62", "I33", "I70"],
        "TO_BE_DELIVERED": ["I59", "RIE", "I15", "I25", "I26", "I39", "ETR", "I11", "I48", "I10", "I22", "I20", "I64", "I24", "I23", "I37", "i62", "I33", "I70"],
        "IN_TRANSIT": ["I59", "RIE", "I15", "I25", "I26", "I39", "ETR", "I11", "I48", "I10", "I22", "I20", "I64", "I24", "I23", "I37", "i62", "I33", "I70"],
        "CREATED_AT_LOGISTIC_PROVIDER": ["I59", "RIE", "I15", "I25", "I26", "I39", "ETR", "I11", "I48", "I10", "I22", "I20", "I64", "I24", "I23", "I37", "i62", "I33", "I70"],
        "DELIVERED": ["ENT"],
        "CANCELLED": ["CAN", "I19", "I63"],
        "DELIVERY_FAILED": ["CAN", "I19", "I63"],
        "NEW": ["ASE", "SEP", "ALS", "POK", "AES", "AAP", "NFS"],
      },
      "statusFromBseller": {
        "I59": ["SHIPPED", "TO_BE_DELIVERED", "IN_TRANSIT", "CREATED_AT_LOGISTIC_PROVIDER"],
        "RIE": ["SHIPPED", "TO_BE_DELIVERED", "IN_TRANSIT", "CREATED_AT_LOGISTIC_PROVIDER"],
        "I15": ["SHIPPED", "TO_BE_DELIVERED", "IN_TRANSIT", "CREATED_AT_LOGISTIC_PROVIDER"],
        "I25": ["SHIPPED", "TO_BE_DELIVERED", "IN_TRANSIT", "CREATED_AT_LOGISTIC_PROVIDER"],
        "I26": ["SHIPPED", "TO_BE_DELIVERED", "IN_TRANSIT", "CREATED_AT_LOGISTIC_PROVIDER"],
        "I39": ["SHIPPED", "TO_BE_DELIVERED", "IN_TRANSIT", "CREATED_AT_LOGISTIC_PROVIDER"],
        "ETR": ["SHIPPED", "TO_BE_DELIVERED", "IN_TRANSIT", "CREATED_AT_LOGISTIC_PROVIDER"],
        "I11": ["SHIPPED", "TO_BE_DELIVERED", "IN_TRANSIT", "CREATED_AT_LOGISTIC_PROVIDER"],
        "I48": ["SHIPPED", "TO_BE_DELIVERED", "IN_TRANSIT", "CREATED_AT_LOGISTIC_PROVIDER"],
        "I10": ["SHIPPED", "TO_BE_DELIVERED", "IN_TRANSIT", "CREATED_AT_LOGISTIC_PROVIDER"],
        "I22": ["SHIPPED", "TO_BE_DELIVERED", "IN_TRANSIT", "CREATED_AT_LOGISTIC_PROVIDER"],
        "I20": ["SHIPPED", "TO_BE_DELIVERED", "IN_TRANSIT", "CREATED_AT_LOGISTIC_PROVIDER"],
        "I64": ["SHIPPED", "TO_BE_DELIVERED", "IN_TRANSIT", "CREATED_AT_LOGISTIC_PROVIDER"],
        "I24": ["SHIPPED", "TO_BE_DELIVERED", "IN_TRANSIT", "CREATED_AT_LOGISTIC_PROVIDER"],
        "I23": ["SHIPPED", "TO_BE_DELIVERED", "IN_TRANSIT", "CREATED_AT_LOGISTIC_PROVIDER"],
        "I37": ["SHIPPED", "TO_BE_DELIVERED", "IN_TRANSIT", "CREATED_AT_LOGISTIC_PROVIDER"],
        "i62": ["SHIPPED", "TO_BE_DELIVERED", "IN_TRANSIT", "CREATED_AT_LOGISTIC_PROVIDER"],
        "I33": ["SHIPPED", "TO_BE_DELIVERED", "IN_TRANSIT", "CREATED_AT_LOGISTIC_PROVIDER"],
        "I70": ["SHIPPED", "TO_BE_DELIVERED", "IN_TRANSIT", "CREATED_AT_LOGISTIC_PROVIDER"],
        "ENT": ["DELIVERED"],
        "CAN": ["CANCELLED", "DELIVERY_FAILED"],
        "I19": ["CANCELLED", "DELIVERY_FAILED"],
        "I63": ["CANCELLED", "DELIVERY_FAILED"],
        "ASE": ["NEW"],
        "SEP": ["NEW"],
        "ALS": ["NEW"],
        "POK": ["NEW"],
        "AES": ["NEW"],
        "AAP": ["NEW"],
        "NFS": ["NEW"]
      }
    }
  ];

  const BsellerToIntelipostCheckStatusEquivalence = async (status_intelipost, status_bseller) => {
    for (const data of BsellerToIntelipostStatusEquivalence) {
      if (
        data.statusFromIntelipost[status_intelipost] &&
        data.statusFromBseller[status_bseller] &&
        data.statusFromBseller[status_bseller].includes(status_intelipost)
      ) {
        return true;
      }
    }
    return false;
  }
  
module.exports = {
  BsellerToIntelipostCheckStatusEquivalence
};