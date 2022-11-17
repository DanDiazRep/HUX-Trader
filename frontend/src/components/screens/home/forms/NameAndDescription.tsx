import { Fragment } from "react"

type Props = {
    name: string,
    setName: (name: string) => void,
    description: string,
    setDescription: (description: string) => void
}

export const NameAndDescription = ({name, setName, description, setDescription}: Props) => {
    return (
        <Fragment>
            <div className="block relative bottom-[120px] px-4">
                <input 
                type="text" 
                name="floating_name" 
                id="floating_name" 
                className="py-2.5 px-0 w-full text-2xl font-bold placeholder-white placeholder-text-xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-[#fd2879] dark:focus:border-[#ff8941] focus:outline-none focus:ring-0 focus:border-[#fd2879] peer" 
                placeholder="Name" required 
                value={name}
                onChange={(e) => setName(e.target.value)}/>
                <label 
                htmlFor="floating_name" 
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#fd2879] peer-focus:dark:text-[#fd2879] peer-placeholder-shown:scale-100  peer-focus:scale-75 ">
                    Name
                </label>
                <input 
                type="text" 
                name="floating_description" 
                id="floating_description" 
                className="py-2.5 px-0 w-full text-ms font-bold placeholder-white placeholder-text-xl text-gray-900 bg-transparent border-b-2 border-gray-300 appearance-none dark:text-white dark:border-[#fd2879] dark:focus:border-[#ff8941] focus:outline-none focus:ring-0 focus:border-[#fd2879] peer" 
                placeholder="Description" required 
                value={description}
                onChange={(e) => setDescription(e.target.value)}/>
                <label 
                htmlFor="floating_description" 
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#fd2879] peer-focus:dark:text-[#fd2879] peer-placeholder-shown:scale-100 peer-focus:scale-75 ">
                    Description
                </label>
            </div>
        </Fragment>
    )
}