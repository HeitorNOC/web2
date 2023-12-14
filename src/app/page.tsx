"use client"

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { LogOut, PencilLine, Plus, Save, Trash2 } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@radix-ui/react-hover-card";

export default function Home() {
  const [userLogged, setUserLogged] = useState<any>();
  const [tasks, setTasks] = useState<any[]>([]);
  const [originalTasks, setOriginalTasks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push('/notAllowed');
    } else {
      createComponent();
    }
  }, [session, status]);

  async function createComponent() {
    const user = session?.user;

    if (user) {
      setUserLogged(user);
      const response = await fetch(`https://task-api-production-ebcc.up.railway.app/api/tasks/${user.id}`, {
        method: 'GET'
      });
      const json = await response.json();
      setTasks(json);
      setOriginalTasks(json);
    } else {
      router.push('/notAllowed');
    }
  }

  async function toggleStatus(taskId: number) {
    const updatedTasks = tasks?.map((task) => {
      if (task.id === taskId) {
        task.status = !task.status;
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  async function saveChanges() {
    await fetch('URL_DO_SEU_BACKEND', {
      method: 'POST',
      body: JSON.stringify(tasks),

    });
    setOriginalTasks([...tasks])
  }

  function cancelChanges() {
    setTasks([...originalTasks]);
  }

  async function updateItem(itemId: number) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === itemId) {

      }
      return task;
    });
    setTasks(updatedTasks);
  }

  async function handleLogOut() {
    await signOut({callbackUrl: '/login', redirect: true})
  }

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return userLogged ? (
    <div className="flex items-center justify-center h-screen">
      <div className="w-1/2 gap-4 h-screen flex flex-col justify-center">
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-6xl">TASK LIST</h1>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-xl">Olá <span className="text-primary font-bold">{userLogged.name}</span>, essas são suas tarefas:</h1>
          <Button variant={"destructive"} className="gap-2" onClick={handleLogOut}>
            <LogOut size={20} />
            Sair
          </Button>

        </div>
        <div className="flex gap-4">


          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"save"}>
                <Plus size={20} />
                Novo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Task</DialogTitle>
                <DialogDescription>
                  Após preencher os campos título e descrição,<br></br> clique em confirmar para adicionar a task.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-start gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" >
                    Título
                  </Label>
                  <Input
                    id="title"
                    className="w-96"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" >
                    Descrição
                  </Label>
                  <Input
                    id="description"
                    className="w-96"
                  />
                </div>
                <Button type="submit" variant={"confirm"} className="px-3">
                  Confirmar
                </Button>
              </div>
            </DialogContent>
          </Dialog>


          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-background border border-gray-300 px-3 py-1 rounded-md w-full text-white"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="pl-8">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <div
                    className={`w-6 h-6 rounded-full mr-4 cursor-pointer ${task.status ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    onClick={() => toggleStatus(task.id)}
                  ></div>
                </TableCell>
                <TableCell className={task.status ? 'line-through text-green-500' : ''}>{task.title}</TableCell>
                <TableCell className={task.status ? 'line-through text-green-500' : ''}>{task.description}</TableCell>
                <TableCell>

                  <div className="flex items-center gap-2">
                    <HoverCard>
                      <HoverCardTrigger>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-transparent">
                              <PencilLine size={20} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Editar Task</DialogTitle>
                              <DialogDescription>
                                Após editar os campos título e descrição,<br></br> clique em confirmar para editar a task.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col items-start gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="title" >
                                  Título
                                </Label>
                                <Input
                                  id="title"
                                  defaultValue={task.title}
                                  className="w-96"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="description" >
                                  Descrição
                                </Label>
                                <Input
                                  id="description"
                                  defaultValue={task.description}
                                  className="w-96"
                                />
                              </div>
                              <Button type="submit" variant={"confirm"} className="px-3">
                                Confirmar
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </HoverCardTrigger>
                      <HoverCardContent side="top" className="mb-1">
                        Editar
                      </HoverCardContent>
                    </HoverCard>

                    <Button className="bg-transparent" variant={"save"}>
                      <Save size={20} />
                    </Button>
                    <Button className="bg-transparent" variant={"destructive"} >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-start w-full mt-4 gap-4">
          <button onClick={saveChanges} className="bg-green-700 text-white px-4 py-2 rounded-md">Salvar Tudo</button>
          <button onClick={cancelChanges} className="bg-red-700 text-white px-4 py-2 rounded-md">Cancelar Alterações</button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}
