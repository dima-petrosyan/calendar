import React, { useState } from 'react'
import { IData } from '../../types/types'

type ListProps = {
    data: IData
}

const ListCustome: React.FC<ListProps> = ({ data }: ListProps) => {

    const { id, parentId, name, children } = data
    const [isHidden, setIsHidden] = useState(false)

    const handleHide = (event: React.MouseEvent<HTMLLIElement>) => {
        event.stopPropagation()
        setIsHidden(prev => !prev)
    }

    return (
        <>
            <li className={`${isHidden && 'hide'} ${children && 'list'}`} style={{cursor: 'pointer'}} onClick={handleHide}>
                <div className='item'>
                    <span>{name}</span>
                    {
                        children && (
                            <span className='subitems'>{children?.length} subitems</span>
                        )
                    }
                </div>
                {
                    children && ( 
                        <ul className={`${isHidden && 'none'}`}>
                            {
                                children.map((item: IData, index: number) => <ListCustome key={index} data={item} />)
                            }
                        </ul>
                    )
                }
            </li>
        </>
    )
}

const AsideMenu: React.FC = () => {

    const data = getData()
    const buildHtmlTree = (arr: Array < IData > ) => {
        return arr.map((item: IData, index: number) => <ListCustome key={index} data={item} />)
    }

    return (
        <aside style={{backgroundColor: 'white', width: 'max-content', height: '100%'}}>
            <ul className='dropdown'>
                {buildHtmlTree(data)}
            </ul>
        </aside>
    )
}

const getData = (): Array <IData> => {
    return (
        [{
                id: 3,
                parentId: null,
                name: "name3",
                children: [{
                    id: 3.1,
                    parentId: 3,
                    name: "name3.1"
                }]
            },
            {
                id: 2,
                parentId: null,
                name: "name2"
            },
            {
                id: 1,
                parentId: null,
                name: "name1",
                children: [{
                        id: 1.1,
                        parentId: 1,
                        name: "name1.1"
                    },
                    {
                        id: 1.2,
                        parentId: 1,
                        name: "name1.2",
                        children: [{
                            id: 1.21,
                            parentId: 1.2,
                            name: "name1.2.1"
                        }]
                    },
                    {
                        id: 1.3,
                        parentId: 1,
                        name: "name1.3"
                    },
                    {
                        id: 1.4,
                        parentId: 1,
                        name: "name1.4"
                    }
                ]
            }
        ]
    )
}



