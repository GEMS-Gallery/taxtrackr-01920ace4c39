import Array "mo:base/Array";
import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Option "mo:base/Option";

actor {
  // Define the TaxPayer type
  public type TaxPayer = {
    tid: Text;
    firstName: Text;
    lastName: Text;
    address: Text;
  };

  // Create a stable variable to store the TaxPayer records
  private stable var taxPayerEntries : [(Text, TaxPayer)] = [];
  private var taxPayers = HashMap.HashMap<Text, TaxPayer>(0, Text.equal, Text.hash);

  // System functions for upgrading
  system func preupgrade() {
    taxPayerEntries := Iter.toArray(taxPayers.entries());
  };

  system func postupgrade() {
    taxPayers := HashMap.fromIter<Text, TaxPayer>(taxPayerEntries.vals(), 0, Text.equal, Text.hash);
  };

  // Add a new TaxPayer record
  public func addTaxPayer(tp: TaxPayer) : async () {
    taxPayers.put(tp.tid, tp);
  };

  // Get all TaxPayer records
  public query func getAllTaxPayers() : async [TaxPayer] {
    Iter.toArray(taxPayers.vals())
  };

  // Search for a TaxPayer by TID
  public query func searchTaxPayer(tid: Text) : async ?TaxPayer {
    taxPayers.get(tid)
  };

  // Update a TaxPayer record
  public func updateTaxPayer(tp: TaxPayer) : async Bool {
    switch (taxPayers.get(tp.tid)) {
      case (null) { false };
      case (?_) {
        taxPayers.put(tp.tid, tp);
        true
      };
    }
  };

  // Delete a TaxPayer record
  public func deleteTaxPayer(tid: Text) : async Bool {
    switch (taxPayers.remove(tid)) {
      case (null) { false };
      case (?_) { true };
    }
  };
}
