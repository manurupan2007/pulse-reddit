declare module "@devvit/public-api" {
  export type SettingDefinition = {
    type: "string" | "boolean" | "number" | "select";
    name: string;
    label: string;
    helpText?: string;
    defaultValue?: string | boolean | number;
    options?: Array<{ label: string; value: string }>;
    scope?: "app" | "installation";
    isSecret?: boolean;
  };

  export type MenuItemDefinition = {
    label: string;
    description?: string;
    forUserType?: "moderator" | "user";
    location: string[];
    onPress?: (event: unknown, context: unknown) => Promise<void> | void;
  };

  export type TriggerDefinition = {
    event?: string;
    events?: string[];
    onEvent: (event: any, context: any) => Promise<void> | void;
  };

  export const Devvit: {
    configure: (config: Record<string, unknown>) => void;
    addSettings: (settings: SettingDefinition[]) => void;
    addMenuItem: (item: MenuItemDefinition) => void;
    addTrigger: (definition: TriggerDefinition) => void;
  };

  export default Devvit;
}
