import { useEffect, useState } from "react";
import { useFaq } from "../hooks/useFaq";
import "./DefaultFaqSpaceSetting.css";

type Props = {
  // This component should only be rendered for authorized admins.
};

export function DefaultFaqSpaceSetting(_props: Props) {
  const useFaqRequest = useFaq();

  const defaultSpaceKey = useFaqRequest.getDefaultKey.data;

  const [spaceKey, setSpaceKey] = useState(defaultSpaceKey || "");

  const spaceKeys = useFaqRequest.getAllSpaceKeys.data || [];

  useEffect(() => {
    async function getKey() {
      await Promise.all([
        useFaqRequest.getDefaultKey.request(),
        useFaqRequest.getAllSpaceKeys.request(),
      ]);
    }
    getKey();
  }, []);

  async function handleSave() {
    const response = await useFaqRequest.sedDefaultKey.request({
      spaceKey: spaceKey.trim(),
    });
    if (response) {
      alert("Default FAQ space saved");
      useFaqRequest.getDefaultKey.updateState((_) => spaceKey);
    }
  }

  if (useFaqRequest.getDefaultKey.status === "loading")
    return <p>Loading FAQ configuration...</p>;

  return (
    <>
      <div className="default-space-setting">
        <div className="default-space-setting__header">
          {/* <h3 className="default-space-setting__title">
            Default Confluence Space
          </h3> */}
          <h4>
            Default Space key:{" "}
            {useFaqRequest.getDefaultKey.data || "Not set yet"}
          </h4>
          <p className="default-space-setting__description">
            Choose the space where new questions will be created by default.
          </p>
        </div>

        <div className="default-space-setting__form">
          <div className="default-space-setting__field">
            <label
              htmlFor="default-space-key"
              className="default-space-setting__label"
            >
              Space
            </label>

            <select
              id="default-space-key"
              className="default-space-setting__select"
              value={spaceKey}
              onChange={(event) => setSpaceKey(event.target.value)}
            >
              <option value="">Select a space</option>

              {spaceKeys.map((spaceKey) => (
                <option key={spaceKey} value={spaceKey}>
                  {spaceKey}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="default-space-setting__save"
            disabled={
              !spaceKey || useFaqRequest.sedDefaultKey.status === "loading"
            }
            onClick={handleSave}
          >
            {useFaqRequest.sedDefaultKey.status === "loading"
              ? "Saving..."
              : "Save changes"}
          </button>
        </div>
      </div>

      {/* {useFaqRequest.sedDefaultKey?.error?.message && (
        <p role="alert">{useFaqRequest.sedDefaultKey?.error?.message}</p>
      )} */}
    </>
  );
}
