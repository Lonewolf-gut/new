import { Badge } from "@/components/ui/badge";
import { type UserProfile as User } from "@/types/interfaces";
import { Building } from "iconoir-react";

interface AffiliationBadgeProps {
  user: User;
}

export function AffiliationBadge({ user }: AffiliationBadgeProps) {

  const userHospital = user?.hospital;
  const isAffiliated = !!userHospital;

  if (isAffiliated) {
    return (
      <div className="w-fit">
        <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border-primary/20">
          <Building className="w-4 h-4" />
          <span className="font-medium">{userHospital.name}</span>
          <span className="text-xs opacity-80">• {userHospital.state}</span>
        </Badge>
      </div>
    );
  } else {
    return (
      <div className="w-fit">
        <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 border-muted-foreground/30">
          <Building className="w-4 h-4" />
          <span>{user.role == "patient" ? "Independant Patient" : "Independant Pratice"} </span>
        </Badge>

      </div>
    );
  }

}