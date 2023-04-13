import { Dropdown, DropdownMenuItem } from '../Dropdown/dropdown';
import ResultTrayStyles from "./resultTray.module.css";

function ResultTray({addNode}) {
    const handle = () => {
        console.log('handling option');
    };
    var nodeType;
    const addElementNode = (e) => {
        e.preventDefault();
        addNode(1,1);
    }
    return (
        <div>
            <Dropdown
                keepOpen
                                // eslint-disable-next-line no-restricted-globals
                open={open}
                trigger={<button className={ResultTrayStyles.big_button}>Add variable...</button>}
                menu={[
                    <DropdownMenuItem onClick={addElementNode}>
                        CRM
                    </DropdownMenuItem>,
                    <DropdownMenuItem onClick={handle}>
                        TAD
                    </DropdownMenuItem>,
                    <DropdownMenuItem onClick={handle}>
                        Gene
                    </DropdownMenuItem>,
                    <DropdownMenuItem onClick={handle}>
                        Protein
                    </DropdownMenuItem>,
                    <DropdownMenuItem onClick={handle}>
                        Omim
                    </DropdownMenuItem>, <DropdownMenuItem onClick={handle}>
                        Gene<br/>
                        ontology
                    </DropdownMenuItem>, <DropdownMenuItem onClick={handle}>
                        Mollecullar<br/>
                        interactions
                    </DropdownMenuItem>,
                ]}
            />
        </div>
    )
}

export default ResultTray;