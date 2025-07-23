import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GymnastForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    club: "",
    category: "",
    discipline: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-6 max-w-xl mx-auto mt-10 space-y-4 border border-gray-200">
      <h2 className="text-2xl font-bold text-center mb-4">Register Gymnast</h2>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dob">Date of Birth</Label>
        <Input
          id="dob"
          type="date"
          value={formData.dob}
          onChange={(e) => handleChange("dob", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Gender</Label>
        <Select onValueChange={(value) => handleChange("gender", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="club">Club</Label>
        <Input
          id="club"
          value={formData.club}
          onChange={(e) => handleChange("club", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select onValueChange={(value) => handleChange("category", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="junior">Junior</SelectItem>
            <SelectItem value="senior">Senior</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Discipline</Label>
        <Select onValueChange={(value) => handleChange("discipline", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select discipline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="artistic">Artistic</SelectItem>
            <SelectItem value="rhythmic">Rhythmic</SelectItem>
            <SelectItem value="teamgym">TeamGym</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full mt-4">
        Submit Gymnast
      </Button>
    </form>
  );
}

