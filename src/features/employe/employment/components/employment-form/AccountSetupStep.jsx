import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const AccountSetupStep = ({ formik }) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="password">Create Password <span className="text-red-500">*</span></Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-2 ${errors.password && touched.password ? "border-red-500" : ""}`}
          placeholder="Enter a strong password"
        />
        {errors.password && touched.password && (
          <p className="text-sm text-red-600 mt-1">{errors.password}</p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-2 ${errors.confirmPassword && touched.confirmPassword ? "border-red-500" : ""}`}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && touched.confirmPassword && (
          <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <div>
        <Label htmlFor="github">GitHub Profile (optional)</Label>
        <Input
          id="github"
          name="github"
          type="url"
          value={values.github}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-2 ${errors.github && touched.github ? "border-red-500" : ""}`}
          placeholder="https://github.com/username"
        />
        {errors.github && touched.github && (
          <p className="text-sm text-red-600 mt-1">{errors.github}</p>
        )}
      </div>

      <div>
        <Label htmlFor="linkedin">LinkedIn Profile (optional)</Label>
        <Input
          id="linkedin"
          name="linkedin"
          type="url"
          value={values.linkedin}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-2 ${errors.linkedin && touched.linkedin ? "border-red-500" : ""}`}
          placeholder="https://linkedin.com/in/username"
        />
        {errors.linkedin && touched.linkedin && (
          <p className="text-sm text-red-600 mt-1">{errors.linkedin}</p>
        )}
      </div>
    </div>
  );
};

export default AccountSetupStep;

