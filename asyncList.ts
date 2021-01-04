
interface runReturn {
    successList: Array<() => Promise<any>>;
    errorList: Array<() => Promise<any>>;
    length:number
}
class asyncList {
    list: Array<() => Promise<any>>;
    runList: Array<Promise<any>>;
    constructor() {
         this.list = [];
         this.runList = [];
    }
    async run(taskNum: number): Promise<runReturn> {
         const errorTask: Array<() => Promise<any>> = [];
         const successTask: Array<() => Promise<any>> = [];
         const runTaskAllStateList = [];
         for (let i = 0; i < taskNum; i++) {
              const task = this.list.shift();
              if (task === undefined) {
                   if (!this.list.length) {
                        break;
                   }
                   continue;
              }
              runTaskAllStateList.push(
                   new Promise(res =>
                        task()
                             .then(() => {
                                  successTask.push(task);
                                  res();
                             })
                             .catch(() => {
                                  errorTask.push(task);
                                  res();
                             })
                   )
              );
         }
         await Promise.all(runTaskAllStateList);
         return {
              successList: successTask,
              errorList: errorTask,
              length:successTask.length+errorTask.length
         };
    }

    addList(...tasks: Array<()=>Promise<any>>):this{
         this.list.push(...tasks);
         return this
    }
    delTask(taskFunction: () => Promise<any>):undefined|(()=>Promise<any>){
         const index = this.list.indexOf(taskFunction);
         if (index !== -1) {
              return this.list.splice(index, 1)[0];
         }
         return undefined;
    }
}

export  { asyncList };