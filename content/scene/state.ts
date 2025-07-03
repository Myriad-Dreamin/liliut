const loadLocalStorage = (key: string): any => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : {};
};

const state = loadLocalStorage("liliut");

/**
 * Greeting to user.
 */
export function greet(name: string): void {
  alert(`${name}死了`);
}
