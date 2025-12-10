// Dummy data for reimbursement claims (aligned with Figma example)
export const dummyReimbursementClaims = [
  {
    uuid: "claim-00005",
    claimNumber: "CLAIM-00005",
    claimDate: new Date("2025-01-11"),
    totalAmount: 100,
    approvedAmount: 80,
    status: "pending",
    bills: [
      {
        salaryDetailComponentUuid: "comp-fuel-001",
        billAmount: 100,
        SalaryDetailComponent: {
          SalaryComponentReimbursement: {
            nameInPaysl: "Fuel Reimbursement"
          }
        }
      }
    ]
  },
  {
    uuid: "claim-00004",
    claimNumber: "CLAIM-00004",
    claimDate: new Date("2025-01-11"),
    totalAmount: 500,
    approvedAmount: 0,
    status: "approve",
    bills: [
      {
        salaryDetailComponentUuid: "comp-laptop-001",
        billAmount: 500,
        SalaryDetailComponent: {
          SalaryComponentReimbursement: {
            nameInPaysl: "Laptop"
          }
        }
      }
    ]
  },
  {
    uuid: "claim-00003",
    claimNumber: "CLAIM-00003",
    claimDate: new Date("2025-01-11"),
    totalAmount: 300,
    approvedAmount: 100,
    status: "rejected",
    bills: [
      {
        salaryDetailComponentUuid: "comp-laptop-001",
        billAmount: 300,
        SalaryDetailComponent: {
          SalaryComponentReimbursement: {
            nameInPaysl: "Laptop"
          }
        }
      }
    ]
  },
  {
    uuid: "claim-00001",
    claimNumber: "CLAIM-00001",
    claimDate: new Date("2025-01-11"),
    totalAmount: 500,
    approvedAmount: 400,
    status: "pending",
    bills: [
      {
        salaryDetailComponentUuid: "comp-fuel-001",
        billAmount: 500,
        SalaryDetailComponent: {
          SalaryComponentReimbursement: {
            nameInPaysl: "Fuel Reimbursement"
          }
        }
      }
    ]
  }
];

// Dummy reimbursement list response structure
export const dummyReimbursementListResponse = {
  list: dummyReimbursementClaims,
  totalPage: 1,
  currentPage: 1,
  totalItems: dummyReimbursementClaims.length
};
