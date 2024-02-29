import { HttpClient } from "@angular/common/http";
import { MenariniApiUrl } from "../../config/menarini-api-url-config";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })

export class ModuleService {
    constructor(
        private _http: HttpClient
      ) { }

    public addHcpDetails(data:any):Observable<any>{
        return this._http.post(MenariniApiUrl.hcpDetails, data);
    }

    // Get All States
    public getHcpRoleData()
    {
        return this._http.get(MenariniApiUrl.getHCPRoleDataApi);
    }

    // Get All HCP Master List
    public getHcpMasterList():Observable<any>
    {
        return this._http.get(MenariniApiUrl.getHcpMasterList);
    }

    // HCP List upload
    public uploadHcpList(payload:any):Observable<any>{
        return this._http.post(MenariniApiUrl.postHcpList, payload);
    }
    // Get All Divisions
    public getDivisionsData()
    {
        return this._http.get(MenariniApiUrl.getDivisionsDataApi);
    }
    // Get All Specialities
    public getSpecialitiesData()
    {

        return this._http.get<any[]>(MenariniApiUrl.getFMVDataApi);
/*        var specialities = new Array();
        specialities.push("Dermal Aesthetics");
        specialities.push("Dermatology");
        specialities.push("Primary Healthcare Physician");
        specialities.push("Other Specialties (Highly Specialized i.e. Plastic Surgeons, Cosmetologists)");
        specialities.push("Other Specialties (Specialized)");
        return specialities;*/
    }
    // Get All SpeakerTypes
    public getSpeakerTypesData()
    {
        var speakerTypes = new Array();
        speakerTypes.push("NGO");
        speakerTypes.push("GO-A");
        return speakerTypes;
    }
    // Get All Countries
    public getCountriesData()
    {
        var countries = new Array();
        countries.push("India");
        return countries;
    }

    public getAllSpeakerCriteriasData()
    {
        var speakerCriterias = new Array();
        speakerCriterias.push("Tier I Criteria");
        speakerCriterias.push("Tier II Criteria");
        speakerCriterias.push("Tier III Criteria");
        return speakerCriterias;
    }

    public getSpeakerCategoryFromCriteria(criteria):String
    {
        
        if("Tier I Criteria"==criteria)
        {
            return 'Tier I';
        }
        if("Tier II Criteria"==criteria)
        {
            return 'Tier II';
        }
        if("Tier III Criteria"==criteria)
        {
            return 'Tier III';
        }

        return '';
    }
    public addSpeakerCodeCreationDetails(data:any):Observable<any>{
        return this._http.post(MenariniApiUrl.speakerCodeCreationDetailsApi, data);
    }
    public getSpeakerCodeCreationDetails():Observable<any[]>{
        return this._http.get<any[]>(MenariniApiUrl.getSpeakerCodeCreationDetailsApi);
    }
    public getApprovedSpeakerCodeCreationDetails():Observable<any[]>{
        return this._http.get<any[]>(MenariniApiUrl.getapprovedspeaker);
    }
    public addTrainerCodeCreationDetails(data:any):Observable<any>{
        return this._http.post(MenariniApiUrl.trainerCodeCreationDetailsApi, data);
    }
    public getTrainerCodeCreationDetails():Observable<any[]>{
        return this._http.get<any[]>(MenariniApiUrl.getTrainerCodeCreationDetailsApi);
    }
    public getApprovedTrainerCodeCreationDetails():Observable<any[]>{
        return this._http.get<any[]>(MenariniApiUrl.getApprovedTrainers);
    }

    // Get All SpeakerTypes
    public getTrainerTypesData()
    {
        var trainerTypes = new Array();
        trainerTypes.push("GO-A");
        trainerTypes.push("NGO");
        return trainerTypes;
    }

    public getAllTrainerCriteriasData()
    {
        var trainerCriterias = new Array();
        trainerCriterias.push("Tier I Criteria");
        trainerCriterias.push("Tier II Criteria");
        return trainerCriterias;
    }

    public getTrainerCategoryFromCriteria(criteria):String
    {
        
        if("Tier I Criteria"==criteria)
        {
            return 'Tier I';
        }
        if("Tier II Criteria"==criteria)
        {
            return 'Tier II';
        }

        return '';
    }    

    public addVendorCreationDetails(data:any):Observable<any>{
        return this._http.post(MenariniApiUrl.vendorCreationDetailsApi, data);
    }
    public getVendorCreationDetails():Observable<any[]>{
        return this._http.get<any[]>(MenariniApiUrl.getVendorCreationDetailsApi);
    }

    // Get All SpeakerTypes
    public getVendorTypesData()
    {
        var vendorTypes = new Array();
        vendorTypes.push("Fillers");
        vendorTypes.push("Threads");
        return vendorTypes;
    }

    public getAllVendorCriteriasData()
    {
        var vendorCriterias = new Array();
        vendorCriterias.push("Tier I Criteria");
        vendorCriterias.push("Tier II Criteria");
        return vendorCriterias;
    }

    public getVendorCategoryFromCriteria(criteria):String
    {
        
        if("Tier I Criteria"==criteria)
        {
            return 'Tier I';
        }
        if("Tier II Criteria"==criteria)
        {
            return 'Tier II';
        }

        return '';
    }
    public getTaxes()
    {
        var taxes = new Array();
        taxes.push("Excluding");
        taxes.push("Including");
        taxes.push("Not Applicable");
        return taxes;
         
    }     

    public getAllLegitimatesNeedData()
    {

        return this._http.get<any[]>(MenariniApiUrl.getLegitimateNeedApi);
/*        var legitimatesNeed = new Array();
        legitimatesNeed.push("To enhance HCP's skills/knowledge gained through virtual/Hands-on experience through scientific conference/seminars/medical books/journal subscriptions");
        legitimatesNeed.push("Improving patient care and medical services by keeping HCPs up to date on the most recent scientific developments");
        return legitimatesNeed;*/
    }
    public getAllObjectiveCriteriasData()
    {
        return this._http.get<any[]>(MenariniApiUrl.getObjectiveCriteriaApi);
/*        var objectiveCriterias = new Array();
        objectiveCriterias.push("HCP has an interest/ is involved in this specific therapeutic area");
        objectiveCriterias.push("HCP has participated in or is in training to participate as specialists, keynote speakers in international, national or regional medical education courses");
        objectiveCriterias.push("HCP has published on renowned and reputable national/international medical journals");
        objectiveCriterias.push("HCP holds a position at academic institution(s) or professional society (international, national or regional)");
        objectiveCriterias.push("HCP is known to be an active contributor to discussion and debate, willing to provide active feedback to other HCPs/local medical peers or to the business");
        objectiveCriterias.push("HCP is involved in the writing of local, regional or global disease management guidelines");
        objectiveCriterias.push("HCP is actively involved in the meeting that is being held (e.g. presenting an abstract in a poster or oral form, or delivering a lecture) in a relevant disease area");
        return objectiveCriterias;*/
    }

    updateSpeakerDataUsingSpeakerId(data){
      return this._http.put(MenariniApiUrl.putUpdateSpeakerDataUsingSpeakerIdApi, data);
    }

    updateTrainerDatausingTrainerId(data){
      return this._http.put(MenariniApiUrl.putUpdateTrainerDatausingTrainerIdApi, data);
    }
}