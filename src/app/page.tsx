"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const [userLogged, setUserLogged] = useState<any>();
  const [tasks, setTasks] = useState<any[]>();

  const session = useSession();
  const router = useRouter();

  const user = session.data?.user;

  useEffect(() => {
    if (session.data) {
      createComponent();
    } else {
      router.push('/notAllowed');
    }
  }, [user]);

  async function createComponent() {
    if (user) {
      setUserLogged(user);
      const response = await fetch(`https://task-api-production-ebcc.up.railway.app/api/tasks/${user.id}`, {
        method: 'GET'
      });
      const json = await response.json();
      setTasks(json);
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

  return tasks ? (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-3">Status</th>
            <th className="border p-3">Título</th>
            <th className="border p-3">Descrição</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-b">
              <td className="border p-3">
                <div
                  className={`w-6 h-6 rounded-full mr-4 cursor-pointer ${
                    task.status ? 'bg-red-500' : 'bg-gray-300'
                  }`}
                  onClick={() => toggleStatus(task.id)}
                ></div>
              </td>
              <td className={`border p-3 ${task.status ? 'line-through text-red-500' : ''}`}>{task.title}</td>
              <td className={`border p-3 ${task.status ? 'line-through text-red-500' : ''}`}>{task.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <></>
  );
}
