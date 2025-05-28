import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const HouseholdMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  age: { type: Number, required: true },
  sex: String,
  civilStatus: String,
  occupation: String,
  education: String,
  sector: String,
  monthlyIncome: String
});

const CensusSchema = new mongoose.Schema({
  // Household Information
  householdNumber: {
    type: Number,
    unique: true,
  },
  address: { type: String, required: true },
  sitio: String,

  
  // Family Head Information
  familyHeadName: { type: String, required: true },
  familyHeadAge: { type: Number, required: true },
  familyHeadSex: { type: String, required: true },
  familyHeadCivilStatus: { type: String, required: true },
  familyHeadOccupation: String,
  familyHeadIncome: String,
  familyHeadEducation: String,
  familyHeadReligion: String,
  familyHeadSector: String,
  
  // Household Members
  householdMembers: [HouseholdMemberSchema],
  
  // Housing Information
  houseType: String,
  roofMaterial: String,
  wallMaterial: String,
  floorMaterial: String,
  waterSource: String,
  toiletFacility: String,
  electricitySource: String,
  cookingFuel: String,
  
  // Contact Information
  contactNumber: String,
  emergencyContact: String,
  
  // Additional Information
  hasDisabledMember: String,
  hasSeniorCitizen: String,
  hasPregnantMember: String,
  hasSoloParent: String,
  additionalNotes: String,
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CensusSchema.plugin(AutoIncrement, {
  inc_field: 'householdNumber',
  start_seq: 1,
});

export default mongoose.models.Census || mongoose.model('Census', CensusSchema);