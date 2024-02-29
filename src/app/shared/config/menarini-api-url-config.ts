// environment
import { url } from 'inspector';
import { environment } from 'src/environments/environment';

// Api base url
const Url: string = environment.basiApiUrl;

export const MenariniApiUrl = {
  //Login
  loginApi: Url + '/LoginAndRegister/Login',
  registerNewApi: Url + '/LoginAndRegister/RegisterNew',
  loginwithGoogleApi: Url + '/LoginAndRegister/LoginwithGoogle',

  //Class I previous Events
  getpreviousEventDataApi: Url + '/GetRequestSheets/GetEventRequestWebData',

  // TO get event types
  getMasterEventTypesData: Url + '/GetMasterSheets/GetEventData',

  // Get Roles
  getRoleDataApi: Url + '/GetMasterSheets/GetRoleData',

  // Get employee details from Employee Master
  getEmployeeDetailsApi: Url + '/LoginAndRegister/GetSheetData',

  // Add New Employees to User Role Master Sheet
  addEmployeesApi: Url + '/UserRoleMaster/AddData',

  // Get Added employees from UserRole Master sheet
  getEventDatafromUserRoleApi: Url + '/UserRoleMaster/GetEventData',

  // Get HCP roles from HCP Role Master
  getHCPRoleDataApi: Url + '/GetMasterSheets/GetHCPRoleData',

  // Update employees in HCP Role Master
  updateEmployeeDataApi: Url + '/UserRoleMaster/UpdateData',

  // Delete Employees from HCP Role Master
  deleteEmployeeDataApi: Url + '/UserRoleMaster/DeleteData/${deleteData.Email}',

  // Get Brand Names
  getBrandNameDataApi: Url + '/GetMasterSheets/GetBrandNameData',

  // Get All States
  getStateNameDataApi: Url + '/GetMasterSheets/GetStateNameData',

  // Get All City
  getCityNameDataApi: Url + '/GetMasterSheets/GetCityNameData',

  // Get Vendor Details
  vendorMasterSheetDataApi: Url + '/GetMasterSheets/VendorMasterSheetData',

  // POST event 1 reques form First set of data
  classIAddDataApi: Url + '/PostReqestSheets/AllObjModelsData',

  // POST brandNames
  addDataListApi: Url + '/EventRequestBrandsList/AddDataList',

  // Getting Employees From HCP Master
  hcpMasterApi: Url + '/GetMasterSheets/HcpMaster',

  // honorarium detail by event id fetching
  honorariumDetailsByIdApi:
    Url + '/GetRequestSheets/GetEventRequestsHcpRoleByIds',

  // get honorarium details
  honorariumDetailsApi: Url + '/GetRequestSheets/GetHCPRoleDetailsData',

  // adding honorarium payment data
  honorariumRequestAddDataApi: Url + '/PostReqestSheets/AddHonorariumData',

  //get Approved Trainers
  getApprovedTrainers: Url + '/GetMasterSheets/GetApprovedTrainersData',

  //get slidekit details
  getSlideKitDetails: Url + '/GetMasterSheets/SlideKitMaster',

  // get approved speaker
  getapprovedspeaker: Url + '/GetMasterSheets/GetApprovedSpeakersData',

  //getting invitees for post event settlement
  getInviteesData: Url + '/GetRequestSheets/GetInviteesData',

  // getting expense for post event settlement
  getExpenseData: Url + '/GetRequestSheets/GetExpenseData',

  // file uploading
  fileuploading: Url + '/Temp/AddFile',

  //getting expense types
  getexpenseType: Url + '/GetMasterSheets/GetExpenseTypeMasterData',

  //  Post Event Settlement
  getInviteesFast: Url + '/GetRequestSheets/GetInviteesData',

  //get expense data for post event settlement
  getPostEventExpense: Url + '/GetRequestSheets/GetExpenseData',

  // event request process sheet for status purpose in event list
  getEventList: Url + '/GetRequestSheets/GetEventRequestProcessData',

  // Get Panel Selection Final Amount
  getPanelSelectionFinalAmount:
    Url +
    '/GetRequestSheets/GetEventRequestsHcpDetailsTotalSpendValue?EventID=',

  // Get Total Expense Final Amount
  getTotalExpenseFinalAmount:
    Url + '/GetRequestSheets/GetEventRequestExpenseSheetAmountValue?EventID=',

  // Get Invitees Final AMount
  getInviteesFinalAmount:
    Url + '/GetRequestSheets/GetEventRequestsInviteesLcAmountValue?EventID=',

  // Event Settlement Final Submit
  postEventSettlement: Url + '/PostReqestSheets/AddEventSettlementData',

  //Added by Sunil
  hcpDetails: Url + '/HcpDetails',
  getHcpRoleData: Url + '/GetMasterSheets/GetHCPRoleData',
  getHcpMasterList: Url + '/GetMasterSheets/HcpMaster',
  postHcpList: Url + '/HCP/PostHcpData',
  getPostEventHcpFollowUp: Url + '/HCPConsultant/HcpFollowUpData',
  postPostEventHcpFollowUp: Url + '/HCPConsultant/HcpFollowup',

  // added by karthick
  fmvCalculation: Url + '/FMV/GetfmvColumnValue?',

  getFCPA: Url + '/FCPAMaster/GetHCPDataUsingMISCode?',

  //Added by Alhad
  getDivisionsDataApi: Url + '/GetMasterSheets/GetDivisionMasterData',
  getHonorariumPaymentDataApi:
    Url + '/GetRequestSheets/GetHonorariumPaymentData',
  getEventSettlementDataApi: Url + '/GetRequestSheets/GetEventSettlementData',
  getSpeakerCodeCreationDetailsApi:
    Url + '/SpeakerCodeCreation/GetSpeakerCodeCreationData',
  speakerCodeCreationDetailsApi: Url + '/SpeakerCodeCreation/AddSpeakersData',
  getTrainerCodeCreationDetailsApi:
    Url + '/TrainerCodeCreation/GetTrainerCodeCreationData',
  trainerCodeCreationDetailsApi: Url + '/TrainerCodeCreation/AddTrainersData',
  vendorCreationDetailsApi: Url + '/VendorCodeCreation/AddVendorData',
  getVendorCreationDetailsApi:
    Url + '/VendorCodeCreation/GetVendorCodeCreationData',
  getMedicalUtilityTypesDataApi: Url + '/GetMasterSheets/GetMedicalUtilityData',

  // POST event 1 reques form First set of data
  stallfabricAddDataApi: Url + '/StallFabrication/PreEventData',

  // Added By Arun
  // Webinar Pre Event POST url
  postWebinarPreEvent: Url + '/Webinar/AllObjModelsData',
  getVendorFiles: Url + '/VendorCodeCreation/Getbase64UsingVendorId?',
  putVendorDetails: Url + '/VendorCodeCreation/UpdateVendorDatausingVendorId',
  getPostEventAttendancePdf: Url + '/AttendenceSheet/AttendencesheetBase64value?',

  // added by karthick
  postHcpConsultantApi: Url + '/HCPConsultant/HCPConsultant',

  postMedicalUtilityPreEventApi: Url + '/medicalPreUtility/PreEventData',
  getRowDataUsingMISCodeApi: Url + '/HCP/GetRowDataUsingMISCode?',

  UpdateFinanceAccountPanelSheetApi:
    Url + '/FinanceTreasuryAndAccounts/UpdateFinanceAccountPanelSheet',

  UpdateFinanceAccountExpenseSheet:
    Url + '/FinanceTreasuryAndAccounts/UpdateFinanceAccountExpenseSheet',

    // Finance Treasury
    putFinaceTreasuryHonorariumRequest: Url + "/FinanceTreasuryAndAccounts/UpdateFinanceTreasuryPanelSheet",
    putFinaceTreasurySettlementReuest:Url + "/FinanceTreasuryAndAccounts/UpdateFinanceTreasuryExpenseSheet",

    
     postAddNewInviteesApi: Url + '/AddorDeleteInvitees/AddNewInvitees',
    
     getLegitimateNeedApi: Url + '/GetMasterSheets/GetLegitimateNeedData', 
     getObjectiveCriteriaApi: Url + '/GetMasterSheets/GetObjectiveCriteriaData', 

     getFMVDataApi: Url + '/FMV/GetFMVData', 
     putUpdateSpeakerDataUsingSpeakerIdApi: Url + '/SpeakerCodeCreation/UpdateSpeakerDatausingSpeakerId',
     putUpdateTrainerDatausingTrainerIdApi: Url + '/TrainerCodeCreation/UpdateTrainerDatausingTrainerId',


     deleteInviteesApi: Url + '/AddorDeleteInvitees/DeleteData/',  
     
    //  download attendence sheet based on event ID
    downloadAttendence: Url + '/AttendenceSheet/GenerateAttendencePDF?EventID=',

    // other deviation files
    otherDeviation: Url + '/GetMasterSheets/DeviationMasterSheetData',

    // employee search for invitee selection
    employeeSearch: Url + '/GetMasterSheets/GetSheetData',
    getRowDataUsingMISCodeandTypeApi: Url + '/HCP/GetRowDataUsingMISCodeandType'
}
