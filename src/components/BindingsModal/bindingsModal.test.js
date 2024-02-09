import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BindingsModal from './bindingsModal';

// Mock data
jest.mock('react-dom', () => ({
    ...jest.requireActual('react-dom'),
    createPortal: (element, target) => element,
}));

const mockNodes = [{
    "id": 0,
    "label": "GENE 0",
    "type": "gene",
    "color": "#c79efc",
    "shape": "ellipse",
    "font": {
        "color": "black"
    },
    "properties": {
        "is instance of": {
            "uri": "http://semanticscience.org/resource/SIO_010035",
            "data": "",
            "show": false,
            "type": "text",
            "transitive": false,
            "operator": "="
        },
        "has name": {
            "uri": "http://www.w3.org/2004/02/skos/core#prefLabel",
            "data": "",
            "show": false,
            "type": "text",
            "transitive": false,
            "operator": "="
        }
    }
},
{
    "id": 1,
    "label": "GENE 1",
    "type": "gene",
    "color": "#a1d68e",
    "shape": "rectangle",
    "font": {
        "color": "white"
    },
    "properties": {
        "is instance of": {
            "uri": "http://semanticscience.org/resource/SIO_010036",
            "data": "",
            "show": false,
            "type": "text",
            "transitive": false,
            "operator": "="
        },
        "has name": {
            "uri": "http://www.w3.org/2004/02/skos/core#prefLabel",
            "data": "Name1",
            "show": false,
            "type": "text",
            "transitive": false,
            "operator": "="
        }
    }
}];

const mockBindings = [{
    "id": 1701791613109,
    "label": "IntervalDifference",
    "operator": "-",
    "firstValue": {
        "label": "End of GENE 0",
        "key": "end",
        "nodeId": 0,
        "propertyUri": "http://purl.obolibrary.org/obo/OGI_1000003"
    },
    "secondValue": {
        "label": "Start of GENE 0",
        "key": "start",
        "nodeId": 0,
        "propertyUri": "http://purl.obolibrary.org/obo/OGI_1000004"
    },
    "showInResults": false
},
{
    "id": 1701791613110,
    "label": "AnotherBinding",
    "operator": "+",
    "firstValue": {
        "label": "End of GENE 1",
        "key": "end",
        "nodeId": 1,
        "propertyUri": "http://purl.obolibrary.org/obo/OGI_1000005"
    },
    "secondValue": {
        "label": "Start of GENE 1",
        "key": "start",
        "nodeId": 1,
        "propertyUri": "http://purl.obolibrary.org/obo/OGI_1000006"
    },
    "showInResults": true
}];

const mockAllBindings = [
    ...mockBindings,
    {
        "id": 1701791613111,
        "label": "NewBindingWithGene2",
        "operator": "*",
        "firstValue": {
            "label": "Start of GENE 2",
            "key": "start",
            "nodeId": 2,
            "propertyUri": "http://purl.obolibrary.org/obo/OGI_1000007"
        },
        "secondValue": {
            "label": "End of GENE 2",
            "key": "end",
            "nodeId": 2,
            "propertyUri": "http://purl.obolibrary.org/obo/OGI_1000008"
        },
        "showInResults": false
    }
];

describe('BindingsModal Component Tests', () => {
    let mockSetBindingsOpen;
    let mockSetBindings;
    let modalRoot;

    beforeEach(() => {
        modalRoot = document.createElement('div');
        modalRoot.setAttribute('id', 'modal-root');
        document.body.appendChild(modalRoot);
        mockSetBindingsOpen = jest.fn();
        mockSetBindings = jest.fn();
    });

    afterEach(() => {
        document.body.removeChild(modalRoot);
    });

    it('should render without crashing', () => {
        render(<BindingsModal allNodes={mockNodes} allBindings={mockAllBindings} bindings={mockBindings} isBindingsOpen={true} setBindingsOpen={mockSetBindingsOpen} setBindings={mockSetBindings} />);
    });

    it('should allow adding a new binding', async () => {
        render(<BindingsModal allNodes={mockNodes} allBindings={mockAllBindings} bindings={mockBindings} isBindingsOpen={true} setBindingsOpen={mockSetBindingsOpen} setBindings={mockSetBindings} />);
        const variableInput = screen.getByLabelText('Variable Input');
        userEvent.type(variableInput, 'New Binding');
        const addButton = screen.getByText('Add binding');
        userEvent.click(addButton);
        const setButton = screen.getByText('Set bindings');
        userEvent.click(setButton);
        await waitFor(() => {
            expect(mockSetBindings).toHaveBeenCalledWith(expect.any(Array));
        });
    });

    it('should update the operator in binding builder', () => {
        render(<BindingsModal allNodes={mockNodes} allBindings={mockAllBindings} bindings={mockBindings} isBindingsOpen={true} setBindingsOpen={mockSetBindingsOpen} setBindings={mockSetBindings} />);
        const operatorSelector = screen.getByLabelText('Operator Selector');
        userEvent.selectOptions(operatorSelector, '-');
        expect(operatorSelector.value).toBe('-');
    });

    it('should update custom value inputs in binding builder', () => {
        render(
            <BindingsModal allNodes={mockNodes} allBindings={mockAllBindings} bindings={mockBindings} isBindingsOpen={true} setBindingsOpen={mockSetBindingsOpen} setBindings={mockSetBindings} />);
        expect(screen.queryByLabelText('First custom value')).toBeNull();
        expect(screen.queryByLabelText('Second custom value')).toBeNull();
        const firstValueDropdown = screen.getByLabelText('First value');
        const secondValueDropdown = screen.getByLabelText('Second value');
        userEvent.selectOptions(firstValueDropdown, '{"custom":true}');
        const firstCustomInput = screen.getByLabelText('First custom value');
        expect(firstCustomInput).toBeInTheDocument();
        expect(screen.queryByLabelText('Second custom value')).toBeNull();
        fireEvent.change(firstCustomInput, { target: { value: '10' } });
        expect(firstCustomInput.value).toBe('10');
        userEvent.selectOptions(secondValueDropdown, '{"custom":true}');
        const secondCustomInput = screen.getByLabelText('Second custom value');
        expect(firstCustomInput).toBeInTheDocument();
        expect(secondCustomInput).toBeInTheDocument();
        fireEvent.change(secondCustomInput, { target: { value: '20' } });
        expect(secondCustomInput.value).toBe('20');
    });

    it('should toggle checkboxes', () => {
        render(<BindingsModal allNodes={mockNodes} allBindings={mockAllBindings} bindings={[]} isBindingsOpen={true} setBindingsOpen={mockSetBindingsOpen} setBindings={mockSetBindings} />);
        const showInResultsCheckbox = screen.getByLabelText('Show in Results');
        const absoluteCheckbox = screen.getByLabelText('Absolute');
        fireEvent.click(showInResultsCheckbox);
        fireEvent.click(absoluteCheckbox);
        expect(showInResultsCheckbox).toBeChecked();
        expect(absoluteCheckbox).toBeChecked();
    });

    it('should show error when binding name is empty or duplicate', async () => {
        render(<BindingsModal allNodes={mockNodes} allBindings={mockAllBindings} bindings={mockBindings} isBindingsOpen={true} setBindingsOpen={mockSetBindingsOpen} setBindings={mockSetBindings} />);
        const variableInput = screen.getByLabelText('Variable Input');
        variableInput.focus();
        const addButton = screen.getByText('Add binding');
        userEvent.click(addButton);
        await waitFor(() => {
            expect(screen.getByLabelText('Input error')).toBeInTheDocument();
        });
        userEvent.type(variableInput, 'IntervalDifference');
        userEvent.click(addButton);
        await waitFor(() => {
            expect(screen.getByLabelText('Input error')).toBeInTheDocument();
        });
    });

    it('should handle removing a binding', async () => {
        render(<BindingsModal allNodes={mockNodes} allBindings={mockAllBindings} bindings={mockBindings} isBindingsOpen={true} setBindingsOpen={mockSetBindingsOpen} setBindings={mockSetBindings} />);
        const removeButton = screen.getByLabelText(`Remove Binding ${mockBindings[0].id}`);
        userEvent.click(removeButton);
        await waitFor(() => {
            expect(mockSetBindings).toHaveBeenCalled();
        });
    });

    it('should close the modal when the close button is clicked', () => {
        render(<BindingsModal allNodes={mockNodes} allBindings={mockAllBindings} bindings={mockBindings} isBindingsOpen={true} setBindingsOpen={mockSetBindingsOpen} setBindings={mockSetBindings} />);
        const closeButtons = screen.getAllByRole('button', { name: /close/i });
        userEvent.click(closeButtons[0]);
        expect(mockSetBindingsOpen).toHaveBeenCalledWith(false);
    });

    it('should submit bindings when the set button is clicked', () => {
        render(<BindingsModal allNodes={mockNodes} allBindings={mockAllBindings} bindings={mockBindings} isBindingsOpen={true} setBindingsOpen={mockSetBindingsOpen} setBindings={mockSetBindings} />);
        const setButton = screen.getByText('Set bindings');
        userEvent.click(setButton);
        expect(mockSetBindings).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should handle updates to existing bindings', async () => {
        render(<BindingsModal allNodes={mockNodes} allBindings={mockAllBindings} bindings={mockBindings} isBindingsOpen={true} setBindingsOpen={mockSetBindingsOpen} setBindings={mockSetBindings} />);
        const showInResultsCheckboxes = screen.getAllByLabelText('Show in Results');
        fireEvent.click(showInResultsCheckboxes[0]);
        const setButton = screen.getByText('Set bindings');
        userEvent.click(setButton);
        await waitFor(() => {
            expect(mockSetBindings).toHaveBeenCalled();
        });
    });

    it('should close the modal correctly when handleClose is triggered', () => {
        render(<BindingsModal allNodes={mockNodes} allBindings={mockAllBindings} bindings={mockBindings} isBindingsOpen={true} setBindingsOpen={mockSetBindingsOpen} setBindings={mockSetBindings} />);
        const closeButton = screen.getByLabelText('Close');
        userEvent.click(closeButton);
        expect(mockSetBindingsOpen).toHaveBeenCalledWith(false);
    });

    it('should properly handle resizing of window', () => {
        global.innerWidth = 500;
        render(<BindingsModal allNodes={mockNodes} allBindings={mockAllBindings} bindings={[]} isBindingsOpen={true} setBindingsOpen={mockSetBindingsOpen} setBindings={mockSetBindings} />);
        fireEvent(window, new Event('resize'));
        const addBindingButton = screen.getByLabelText('Add Binding');
        expect(addBindingButton).toBeInTheDocument();
    });
})
