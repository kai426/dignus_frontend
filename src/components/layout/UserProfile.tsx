import userAvatar from "@/assets/BemolRecruta_Assets/images/avatar.png";

const UserProfile = ({ isExpanded }: { isExpanded: boolean }) => {
  return (
    <div
      className={`
        flex items-center w-full rounded-lg transition-colors hover:bg-black/10
        ${isExpanded ? "gap-3 p-2" : "justify-center h-12"}
      `}
    >
      <img
        src={userAvatar}
        alt="Avatar do usuário"
        className="size-10 shrink-0 rounded-full object-cover"
      />
      <div
        className={`
          overflow-hidden transition-opacity duration-200
          ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        <p className="font-bold text-sm whitespace-nowrap">Paloma Silva</p>
        <p className="text-xs text-white/80 whitespace-nowrap">
          paloma.silva@bemol.com.br
        </p>
      </div>
    </div>
  );
};

export default UserProfile;