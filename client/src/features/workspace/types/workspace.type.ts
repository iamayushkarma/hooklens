export interface WorkspaceProp {
  _id: string;
  name: string;
  yourRole: "owner" | "admin" | "member" | "viewer";
  memberCount: number;
  projectCount: number;

  createdAt: string;
  updatedAt: string;
}
