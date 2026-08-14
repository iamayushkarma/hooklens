type ClassInput =
  | string
  | false
  | null
  | undefined
  | Record<string, boolean | null | undefined>
  | ClassInput[];

export function cn(...inputs: ClassInput[]) {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (Array.isArray(input)) {
      classes.push(cn(...input));
      continue;
    }

    if (typeof input === "object") {
      Object.entries(input).forEach(([key, value]) => {
        if (value) classes.push(key);
      });
      continue;
    }

    classes.push(input);
  }

  return classes.join(" ");
}
