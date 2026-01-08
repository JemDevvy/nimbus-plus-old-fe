import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export const useProjectData = (id: string | number) => {
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }

    const fetchProjectDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProjectDetails(data);
      } catch {
        setProjectDetails(null);
        setError("Failed to fetch project details");
      }
    };

    const fetchMembers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/project-members/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const membersRaw = data.members || data;

        const membersWithNames = await Promise.all(
          membersRaw.map(async (member: any) => {
            try {
              const userRes = await fetch(`${API_URL}/api/users/${member.userId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!userRes.ok) return member;

              const userData = await userRes.json();
              return {
                ...member,
                name: userData.name || userData.fullName || "",
                accountStatus: userData.accountStatus || "",
                email: userData.email || "",
              };
            } catch {
              return member;
            }
          })
        );
        setMembers(membersWithNames);
      } catch {
        setError("Failed to fetch members");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
    fetchMembers();
  }, [id]);

  return { projectDetails, members, loading, error };
};
