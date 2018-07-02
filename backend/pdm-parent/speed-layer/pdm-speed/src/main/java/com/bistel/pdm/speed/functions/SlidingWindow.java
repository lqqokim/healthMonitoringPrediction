package com.bistel.pdm.speed.functions;

import java.util.ArrayList;
import java.util.Deque;
import java.util.LinkedList;

public class SlidingWindow {

    public ArrayList<Integer> maxSlidingWindow(int[] nums, int k) {
        ArrayList<Integer> rst = new ArrayList<>();
        if (nums == null || nums.length == 0 || k < 0) {
            return rst;
        }
        Deque<Integer> deque = new LinkedList<>();
        for (int i = 0; i < k; i++) {
            while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) {
                deque.pollLast();
            }
            deque.offerLast(i);
        }

        for (int i = k; i < nums.length; i++) {
            rst.add(nums[deque.peekFirst()]);
            if (!deque.isEmpty() && deque.peekFirst() <= i - k) {
                deque.pollFirst();
            }
            while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) {
                deque.pollLast();
            }
            deque.offerLast(i);
        }

        //Last move's result needs to be recorded:
        rst.add(nums[deque.peekFirst()]);
        return rst;
    }
}
