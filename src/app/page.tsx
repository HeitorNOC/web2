"use client"

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { AlertCircle, LogOut, PencilLine, Plus, Save, Trash2 } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function Home() {
  const [userLogged, setUserLogged] = useState<any>();
  const [tasks, setTasks] = useState<any[]>([]);
  const [originalTasks, setOriginalTasks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newTastkTitleInput, setNewTaskTitleInput] = useState('')
  const [newTastkDescriptionInput, setNewTaskDescriptionInput] = useState('')
  const [updateTaskTitleInput, setUpdateTaskTitleInput] = useState('')
  const [updateTaskDescriptionInput, setUpdateTaskDescriptionInput] = useState('')

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

  async function saveChanges(taskID: number) {
    const fullTask = tasks.find((task) => task.id == taskID)
    const res = await fetch(`https://task-api-production-ebcc.up.railway.app/api/tasks/${taskID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...fullTask })
    })

    if (!res.ok) {
      window.alert('Status não foi editado.')
      router.push('/')
    } else {
      window.location.reload()
    }
  }

  function cancelChanges() {
    window.location.reload()
  }

  async function saveAllChanges() {
    for (let e = 0;tasks.length > e;e++) {
      const responseCreate = await fetch(`https://task-api-production-ebcc.up.railway.app/api/tasks/${tasks[e].id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: tasks[e].title,
          description: tasks[e].description,
          status: tasks[e].status
        })
      })
      if (!responseCreate.ok) {
        window.alert('Erro ao salvar dados.')
        return
      }
    }
    window.location.reload()
  }

  async function updateItem(itemId: number) {
    const status = tasks.find((task) => task.id == itemId).status
    const res = await fetch(`https://task-api-production-ebcc.up.railway.app/api/tasks/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: updateTaskTitleInput,
        description: updateTaskDescriptionInput,
        status
      })
    })
    if (!res.ok) {
      window.alert('Erro ao atualizar a task.')
      window.location.reload()
      return
    } else {
      window.location.reload()
    }
  }

  async function handleLogOut() {
    await signOut({ callbackUrl: '/login', redirect: true })
  }

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleSubmitNewTask() {
    if (newTastkTitleInput.length > 2 && newTastkDescriptionInput.length > 2) {
      const res = await fetch('https://task-api-production-ebcc.up.railway.app/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTastkTitleInput,
          description: newTastkDescriptionInput,
          status: false,
          userId: userLogged.id
        })
      })

      if (!res.ok) {
        window.alert('Erro ao criar a task.')
        router.push('/')
      } else {
        window.alert('Task adicionada com sucesso.')
        setNewTaskDescriptionInput('')
        setNewTaskTitleInput('')
        window.location.reload()
      }
    }
  }

  async function handleDeleteTask(taskID: number) {
    const res = await fetch(`https://task-api-production-ebcc.up.railway.app/api/tasks/${taskID}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      const json = await res.json()
      window.alert('Erro ao remover a task.' + taskID + json)
      return
    } else {
      window.location.reload()
    }
  }

  return userLogged ? (
    <div className="flex items-center justify-center h-screen py-96">
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
                    value={newTastkTitleInput}
                    onChange={(e) => setNewTaskTitleInput(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" >
                    Descrição
                  </Label>
                  <Input
                    id="description"
                    className="w-96"
                    value={newTastkDescriptionInput}
                    onChange={(e) => setNewTaskDescriptionInput(e.target.value)}
                  />
                </div>
                <Button id="addNewTask" key={"addNewTask"} type="button" onClick={handleSubmitNewTask} variant={"confirm"} className="px-3" >
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
            {tasks.length > 1 ? filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Checkbox
                    onClick={() => toggleStatus(task.id)}
                    checked={task.status}
                  />
                </TableCell>
                <TableCell className={task.status ? 'line-through text-green-500' : ''}>{task.title}</TableCell>
                <TableCell className={task.status ? 'line-through text-green-500' : ''}>{task.description}</TableCell>
                <TableCell>

                  <div className="flex items-center gap-2">
                    <HoverCard>
                      <HoverCardTrigger>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-transparent" onClick={(e) => {
                              setUpdateTaskTitleInput(task.title);
                              setUpdateTaskDescriptionInput(task.description)
                            }}>
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
                                  className="w-96"
                                  value={updateTaskTitleInput}
                                  onChange={(e) => setUpdateTaskTitleInput(e.target.value)}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="description" >
                                  Descrição
                                </Label>
                                <Input
                                  id="description"
                                  className="w-96"
                                  value={updateTaskDescriptionInput}
                                  onChange={(e) => setUpdateTaskDescriptionInput(e.target.value)}
                                />
                              </div>
                              <Button id="updateTask" key={"updateTask"} type="button" onClick={() => updateItem(task.id)} variant={"confirm"} className="px-3">
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

                    <Button id="saveTask" key={"saveTask"} className="bg-transparent" variant={"save"} onClick={() => saveChanges(task.id)}>
                      <Save size={20} />
                    </Button>
                    <Button id="deleteTask" key={"deleteTask"} className="bg-transparent" variant={"destructive"} onClick={(e) => handleDeleteTask(task.id)} >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <div className="py-10">
                <Alert variant="destructive" className="flex flex-col items-start justify-start">
                  <AlertCircle className="h-4 w-4 mt-2" />
                  <AlertTitle className="text-lg font-bold">Você não tem nenhuma task criada.</AlertTitle>
                  <AlertDescription>
                    Clique em <span>Novo</span> para criar uma task nova.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-start w-full mt-4 gap-4">
          <button id="saveAllTasks" key={"saveAllTasks"} onClick={saveAllChanges} className="bg-green-700 text-white px-4 py-2 rounded-md">Salvar Tudo</button>
          <button id="cancelTasks" key={"cancelTasks"} onClick={cancelChanges} className="bg-red-700 text-white px-4 py-2 rounded-md">Cancelar Alterações</button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}
