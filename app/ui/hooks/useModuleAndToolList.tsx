import { useQuery } from "@tanstack/react-query";
import { fetchModuleAndToolList } from "../api/wafers/request";

export const useModuleAndToolList = () => {
    const query = useQuery({
        queryKey: ['ModuleAndToolList'],
        queryFn: fetchModuleAndToolList
    })

    return {
        moduleOptionList: query.data?.moduleId,
        toolOptionList: query.data?.toolId,
    }
}