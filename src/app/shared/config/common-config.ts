
export const Config = {
    MESSAGE: {
        SUCCESS: {
            "ADD_HCP": "HCP Added Successfully",
            "ADD_SPEAKERCODE": "Speaker Code Added Successfully",
            "ADD_TRAINERCODE": "Trainer Code Added Successfully",
            "ADD_VENDOR": "Vendor Added Successfully",
            "ADD_INVITEE": "Invitee Added Successfully",
            "DELETE_INVITEE": "Invitee Deleted Successfully",

            // Added By Arun
            "LOGIN_SUCCESS" : "Logged In Successfully",
            "ADD_PRE_EVENT" : "Event Submitted Successfully",
            "ADD_HONARARIUM" : "Honararium Submitted Successfully",
            "ADD_POST_SETTLEMENT" : "Post Event Settlement Submitted Successfully",
            "LOG_OUT" : "Logged Out Successfully",
            "FINANCE_TREASURY": "Finance Treasury Data Updated Successfully",
            "FINANCE_ACCOUNTS" : "Finance Account Data Updated Successfully",
            "BENIFICIARY_UPDATE": "Benificiary Details Updated Successfully"
        },
        ERROR: {
            "ADD_HCP": "HCP Failed to add",
            "ADD_SPEAKERCODE": "Speaker Code Failed to add",
            "ADD_TRAINERCODE": "Trainer Code Failed to add",
            "ADD_VENDOR": "Vendor Failed to add",
            "ADD_INVITEE": "Invitee Failed to add",
            "DELETE_INVITEE": "Invitee Failed to deleted",

            // by karthick
            "HONORARIUM_LIMIT":"Honorarium Amount Limit Should Be In Aggregate Limit",
            "AGGREGATES_LIMIT":"Aggregates Spend Limit excceded. Please upload Deviation",
            "LOCALCONVENYENCESELECT":"Fill Local Conveyence Details",
            "MIS_CODE_NOT_PICKED":"Select your Invitee",
            "MENARINI_EMPLOYEE_CODE_MISSING":"Enter your Employee Code",
            "ENTERS_OTHERS_INVITEE_NAME":"Enter Invitee Name",
            "FILL_DETAILS":"Fill All Details",
            "OTHER_DEVIATION_ERROR":"Other Deviation field is missing",

            // Added By Arun
            "BRAND_PERCENT": "Percentage Allocation Should be Exactly 100",
            "FCPA_DATE": "FCPA Date is missing",
            "FILL_HONARARIUM": "Honararium Details are missing",
            "FILL_BENIFICIARY": "Benificiary Details are missing",
            "FILL_HCP_ROLE": "HCP Role Details are missing",
            "FILL_RATIONALE": "Rationale is missing",
            "FILL_TRAVEL": "Travel Deatails are missing",
            "FILL_ACCOMODATION": "Accomodation Deatails are missing",
            "FILL_LOCAL_CONVEYANCE": "Local Conveyance Deatails are missing",
            "FILL_MIS": "MIS Code is missing",
            "NO_DATA": "No Data Found",
            "FILL_FCPA": "FCPA Details are missing",
            "MAX_HOURS": "Max of 480 minutes only",
            "AMOUNT_INCLUDING_TAX": "Amount Including Tax Should be greater than or equal to excluding tax",
            


            // LOGIN ERROR
            "INVALID_CREDENTIAL": "Username or Password is invalid",

            // SERVER ERROR
            "SERVER_ERR": "Sorry Something went wrong",

            // FILE ERROR
            "FILE_TYPE": "File type is not supported",
            "FILE_SIZE":  "File should be greater than 0KB and less than 30MB", 
            "FILE_UPLOAD": "Upload all files",
            
            "FILL_ALL" : "Fill all fields",
            "NO_FOLLOW_UP": "No Follow Up Events To Submit"
        }
    },
    SNACK_BAR: {
        DELAY: 3000,
        SUCCESS: 'success',
        ERROR: 'error'
    },
    HCP_MASTER: {
        SUCCESS: {
            FILE_UPLOAD: "HCP List created successfully"
        },
        ERROR: {
            INVALID_FILE: "Please upload a valid excel file"
        },
        FILTER_LIMIT: 15
    },
    FILE: {
        ALLOWED: ["png", "jpg", "jpeg", "pdf", "txt", "docx"],
        MIN_SIZE: 1,
        MAX_SIZE: 30000000
    },
    PAGINATION: {
        ROW_LIMIT: 10
    },

    // Phase 2
    EVENT_CODE: {
        CLASS_II: 'EVTC2'
    }


}