import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AddressInfoStep = ({ formik }) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Address</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="primaryStreet">Street Address</Label>
            <Input
              id="primaryStreet"
              name="primaryStreet"
              value={values.primaryStreet}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-2"
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primaryCity">City <span className="text-red-500">*</span></Label>
              <Input
                id="primaryCity"
                name="primaryCity"
                value={values.primaryCity}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-2 ${errors.primaryCity && touched.primaryCity ? "border-red-500" : ""}`}
              />
              {errors.primaryCity && touched.primaryCity && (
                <p className="text-sm text-red-600 mt-1">{errors.primaryCity}</p>
              )}
            </div>

            <div>
              <Label htmlFor="primaryState">State/Province</Label>
              <Input
                id="primaryState"
                name="primaryState"
                value={values.primaryState}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="primaryZipCode">Zip/Postal Code</Label>
            <Input
              id="primaryZipCode"
              name="primaryZipCode"
              value={values.primaryZipCode}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Secondary Address (Optional)</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="secondaryStreet">Street Address</Label>
            <Input
              id="secondaryStreet"
              name="secondaryStreet"
              value={values.secondaryStreet}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-2"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="secondaryCity">City</Label>
              <Input
                id="secondaryCity"
                name="secondaryCity"
                value={values.secondaryCity}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="secondaryState">State/Province</Label>
              <Input
                id="secondaryState"
                name="secondaryState"
                value={values.secondaryState}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressInfoStep;
