"use client";
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, CircleXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useTaskContext } from "@/context/TaskContext";
import { useTheme } from "next-themes";

const AppTaskCard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const addTask = () => {
    if (newTitle && selectedDate) {
      createTask({
        id: Date.now(),
        title: newTitle,
        date: selectedDate,
        completed: false,
      });

      setNewTitle("");
      setOpen(false);
    }
  };

  const { tasks, createTask, toggleTask, deleteTask } = useTaskContext();
  const { theme } = useTheme();
  if (theme === "dark") {
    console.log("Dark theme");
  }
  return (
    <Card className=" h-full flex-col p-4">
      <h1 className="text-lg font-medium">Task list</h1>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="w-full">
            <CalendarIcon />
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-4 w-auto">
          <div className="flex flex-col gap-2 mb-4">
            <Input
              className={"mb-2"}
              placeholder="Task description"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Button onClick={addTask}>Add Task</Button>
          </div>

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
            }}
            className="rounded-md "
          />
        </PopoverContent>
      </Popover>
      <ScrollArea className="h-full w-full flex-1 [&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-450px)] pr-4">
        <div className="flex flex-col gap-4">
          {tasks.map((task) => (
            <Card
              className={`p-4 cursor-pointer !border border-gray-300 hover:bg-green-100 dark:hover:bg-gray-900 ${task.completed ? " dark:bg-gray-900 bg-green-100" : ""}`}
              key={task.id}
              onClick={() => toggleTask(task.id)}
            >
              <div className="flex items-center gap-4 cursor-pointer">
                <Checkbox
                  id={task.id.toString()}
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="cursor-pointer"
                />
                <label
                  htmlFor={task.id.toString()}
                  className="flex-1 text-sm font-medium cursor-pointer"
                >
                  {task.title} –{" "}
                  {task.date?.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                  })}
                </label>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                  }}
                  variant="ghost"
                  className="!bg-transparent hover:bg-transparent p-1 text-red-500 hover:text-red-600 cursor-pointer hover:scale-110"
                >
                  <CircleXIcon />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default AppTaskCard;
