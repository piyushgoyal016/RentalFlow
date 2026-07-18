import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { rentalService } from "@/services/rentalService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, daysBetween } from "@/lib/utils";
import { toast } from "sonner";
import { Calendar, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

function RentalDialog({ product, open, onClose }) {
  const [step, setStep] = useState(1); // 1=dates, 2=review, 3=success
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [rental, setRental] = useState(null);
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const duration =
    startDate && endDate ? daysBetween(startDate, endDate) : 0;
  const totalAmount = duration * product.dailyRate;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const result = await rentalService.createRental({
        product,
        startDate,
        endDate,
        duration,
      });
      setRental(result);
      setStep(3);
      toast.success("Rental confirmed!", {
        description: `Your rental ID is ${result.id}`,
      });
    } catch (error) {
      toast.error("Failed to create rental", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Select Rental Duration</DialogTitle>
              <DialogDescription>
                Choose your rental start and end dates
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="p-3 rounded-lg bg-slate-50 flex items-center gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {product.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatCurrency(product.dailyRate)}/day
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    min={today}
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (endDate && e.target.value >= endDate) setEndDate("");
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    min={startDate || today}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={!startDate}
                  />
                </div>
              </div>

              {duration > 0 && (
                <div className="flex items-center gap-2 text-sm text-primary-600 bg-primary-50 p-3 rounded-lg">
                  <Calendar className="h-4 w-4" />
                  {duration} day{duration > 1 ? "s" : ""} rental
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!startDate || !endDate || duration < 1}
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle>Review & Confirm</DialogTitle>
              <DialogDescription>
                Review your rental details before confirming
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="p-4 rounded-xl bg-slate-50 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Product</span>
                  <span className="font-medium text-slate-900">{product.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-medium text-slate-900">{duration} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Dates</span>
                  <span className="font-medium text-slate-900">
                    {startDate} → {endDate}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Daily Rate × {duration}
                  </span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Security Deposit</span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(product.securityDeposit)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-900">
                    Total Payable
                  </span>
                  <span className="text-lg font-bold text-primary-600">
                    {formatCurrency(totalAmount + product.securityDeposit)}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-400">
                * Security deposit is refundable upon return in good condition.
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleConfirm} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Rental"
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 3 && (
          <>
            <div className="text-center space-y-4 py-4">
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-success-50">
                <CheckCircle2 className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Rental Confirmed!
              </h3>
              <p className="text-sm text-slate-500">
                Your rental has been successfully created.
              </p>
              {rental && (
                <Badge variant="default" className="text-sm px-4 py-1">
                  Rental ID: {rental.id}
                </Badge>
              )}
            </div>

            <DialogFooter className="flex-col gap-2">
              <Button
                className="w-full"
                onClick={() => {
                  onClose();
                  navigate("/my-rentals");
                }}
              >
                View My Rentals
              </Button>
              <Button variant="outline" className="w-full" onClick={onClose}>
                Continue Browsing
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { RentalDialog };
