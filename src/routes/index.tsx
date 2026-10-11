import { createFileRoute } from "@tanstack/react-router";
import { OutubroRosaPage, outubroRosaHead } from "@/components/OutubroRosaPage";

// A LP do Outubro Rosa é a única página do site e fica na raiz.
export const Route = createFileRoute("/")({
  component: OutubroRosaPage,
  head: () => outubroRosaHead("/"),
});
