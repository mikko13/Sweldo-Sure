import { PlusCircle, Trash2, Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function PositionsTab({
  positions,
  newPosition,
  setNewPosition,
  handleAddPosition,
  handleDeletePosition,
  handleUpdatePosition,
  handleTogglePositionStatus,
  toast,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [isToggling, setIsToggling] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState(null);

  function startEditing(position) {
    setEditingId(position._id);
    setEditTitle(position.title);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditTitle("");
  }

  function saveEdit(id) {
    if (editTitle.trim()) {
      handleUpdatePosition(id, editTitle);
      setEditingId(null);
    } else {
      toast({
        title: "Error",
        description: "Position title cannot be empty",
        variant: "destructive",
      });
    }
  }

  async function handleToggle(id, currentStatus) {
    setIsToggling((prev) => ({ ...prev, [id]: true }));
    try {
      await handleTogglePositionStatus(id, currentStatus);
    } catch (error) {
      console.error("Failed to toggle position status:", error);
    } finally {
      setIsToggling((prev) => ({ ...prev, [id]: false }));
    }
  }

  function confirmDelete(position) {
    setPositionToDelete(position);
    setDeleteDialogOpen(true);
  }

  function handleConfirmDelete() {
    if (positionToDelete) {
      handleDeletePosition(positionToDelete._id);
      setDeleteDialogOpen(false);
      setPositionToDelete(null);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-2">
          Add New Position
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            value={newPosition}
            onChange={(e) => setNewPosition(e.target.value)}
            placeholder="Enter position title"
            className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAddPosition}
            className="w-full sm:w-auto cursor-pointer bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white px-3 py-2 sm:py-0 rounded-md text-sm flex items-center justify-center transition-all duration-200 shadow-md"
            disabled={!newPosition.trim()}
          >
            <PlusCircle size={18} className="mr-2" />
            <span>Add Position</span>
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Current Positions
        </h2>
        {positions.length === 0 ? (
          <p className="text-gray-500 italic">
            No positions have been added yet.
          </p>
        ) : (
          <div className="bg-gray-50 rounded-lg border border-gray-200">
            {positions.map((position) => (
              <div
                key={position._id}
                className={`flex items-center justify-between py-3 px-4 ${
                  position !== positions[positions.length - 1]
                    ? "border-b border-gray-200"
                    : ""
                }`}
              >
                {editingId === position._id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(position._id)}
                      className="cursor-pointer text-green-600 hover:text-green-800"
                      aria-label="Save"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="cursor-pointer text-gray-600 hover:text-gray-800"
                      aria-label="Cancel"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex items-center">
                      <span
                        className={`text-gray-700 ${
                          !position.isActive ? "text-opacity-60" : ""
                        }`}
                      >
                        {position.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={position.isActive}
                            onChange={() =>
                              handleToggle(position._id, position.isActive)
                            }
                            disabled={isToggling[position._id]}
                          />
                          <div
                            className={`w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${
                              position.isActive
                                ? "peer-checked:bg-blue-600"
                                : ""
                            }`}
                          ></div>
                          <span className="ml-2 text-sm text-gray-500">
                            {position.isActive ? "Active" : "Inactive"}
                          </span>
                        </label>
                      </div>
                      <button
                        onClick={() => startEditing(position)}
                        className="cursor-pointer text-blue-500 hover:text-blue-700 transition-colors duration-200"
                        aria-label="Edit position"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => confirmDelete(position)}
                        className="cursor-pointer text-red-500 hover:text-red-700 transition-colors duration-200"
                        aria-label="Delete position"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the position "
              {positionToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PositionsTab;
