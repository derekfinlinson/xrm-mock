import { AttributeMock } from "../../../src/xrm-mock/attributes/attribute/attribute.mock";
import { ItemCollectionMock } from "../../../src/xrm-mock/collection/itemcollection/itemcollection.mock";
import { DataMock } from "../../../src/xrm-mock/data/data.mock";
import { EntityMock } from "../../../src/xrm-mock/entity/entity.mock";
import { FormContextMock } from "../../../src/xrm-mock/formcontext/formcontext.mock";
import { PageMock } from "../../../src/xrm-mock/page/page.mock";

describe("Xrm.Entity Mock", () => {
    beforeEach(() => {
        this.id = "{0}";
        this.entityName = "contact";
        const attributes: Xrm.Attributes.Attribute[] = [];
        attributes.push(new AttributeMock({ name: "firstname", value: "Joe", isDirty: false, requiredLevel: "none" }));
        attributes.push(new AttributeMock({ name: "description", value: "" }));
        this.lastName = new AttributeMock({
            isDirty: false,
            name: "lastname",
            requiredLevel: "recommended",
            submitMode: "always",
            value: "Bloggs",
        });
        attributes.push(this.lastName);

        this.formContext = new FormContextMock(new DataMock(this.entityMock), null);
        this.entityMock = new EntityMock({id: this.id, entityName: this.entityName, attributes: new ItemCollectionMock<Xrm.Attributes.Attribute>(attributes)});
        this.xrmPageMock = new PageMock(null, this.formContext);
    });

    it("should exist", () => {
        expect(this.entityMock).toBeDefined();
    });

    it("should not be dirty", () => {
        expect(this.entityMock.getIsDirty()).toBe(false);
    });

    it("should be dirty when an attribute value changes", () => {
        expect(this.entityMock.getIsDirty()).toBe(false);
        this.lastName.setValue("Lasty");
        expect(this.lastName.getValue()).toBe("Lasty");
        expect(this.lastName.getIsDirty()).toBe(true);
        expect(this.entityMock.getIsDirty()).toBe(true);
    });

    it("should get an id of 0", () => {
        expect(this.entityMock.getId()).toBe(this.id);
    });

    it ("should get an entityName of contact", () => {
        expect(this.entityMock.getEntityName()).toBe(this.entityName);
    });

    it ("should add and execute onSave event", () => {
        let depth: number;

        function onSave(context: Xrm.Events.SaveEventContext) {
            depth = context.getDepth();
        }

        this.entityMock.addOnSave(onSave);

        expect(this.entityMock.saveEventHandlers.length).toBe(1);

        this.entityMock.save();

        expect(depth).toBe(0);
    });

    it ("should remove an onSave event", () => {
        // tslint:disable-next-line:no-empty
        function onSave(context: Xrm.Events.SaveEventContext) {
        }

        this.entityMock.addOnSave(onSave);
        this.entityMock.removeOnSave(onSave);

        expect(this.entityMock.saveEventHandlers.length).toBe(0);
    });
});
