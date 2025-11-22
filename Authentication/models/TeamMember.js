import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true },      
  jiraAccountId: { type: String, required: true }
});

export default mongoose.model("TeamMember", teamMemberSchema);
