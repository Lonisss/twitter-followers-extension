import { AtSymbolIcon } from "@heroicons/react/outline";
import { Button, TextInput } from "@mantine/core";
import { useState } from "react";

export const ChangeOriginUser = ({
  cancelNewUser,
  registerNewUser,
}: {
  cancelNewUser: () => void;
  registerNewUser: (username: string) => void;
}) => {
  const [originUserText, setOriginUserText] = useState("");

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput
        value={originUserText}
        onChange={(e) => setOriginUserText(e.target.value)}
        placeholder="Your twitter username"
        icon={<AtSymbolIcon className="w-4" />}
      />
      <Button
        onClick={() => registerNewUser(originUserText)}
        color="gray"
        className="mt-2"
      >
        Submit
      </Button>

      {localStorage.getItem("originUserKey") && (
        <Button onClick={cancelNewUser} color="gray" className="mt-2">
          Cancel
        </Button>
      )}
    </div>
  );
};
